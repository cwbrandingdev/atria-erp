import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ContentPostStatus,
  ContractStatus,
  EventCategory,
  KanbanColumnType,
  KanbanTaskPriority,
  Prisma,
} from '@prisma/client';
import { AiService } from '../ai/ai.service';
import { ContentService } from '../content/content.service';
import { KanbanService } from '../kanban/kanban.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateBriefPlanDto,
  GenerateBriefPlanDto,
} from './dto/brief-to-content.dto';

const PLATFORM_COLORS: Record<string, string> = {
  INSTAGRAM: '#E1306C',
  TIKTOK: '#000000',
  YOUTUBE: '#FF0000',
  LINKEDIN: '#0A66C2',
};

const postSelect = {
  id: true,
  title: true,
  platform: true,
  format: true,
  status: true,
  scheduledDate: true,
  updatedAt: true,
  client: {
    select: { id: true, companyName: true, avatarUrl: true },
  },
  assignee: { select: { id: true, name: true, avatarUrl: true } },
  _count: { select: { attachments: true, versions: true } },
} satisfies Prisma.ContentPostSelect;

const taskInclude = {
  column: { select: { id: true, title: true, type: true } },
  client: { select: { id: true, companyName: true, avatarUrl: true } },
  assignees: {
    include: { user: { select: { id: true, name: true, avatarUrl: true } } },
  },
} satisfies Prisma.KanbanTaskInclude;

function getWeekBounds(reference = new Date()) {
  const start = new Date(reference);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

function toLowerEnum<T extends string>(value: T) {
  return value.toLowerCase() as Lowercase<T>;
}

@Injectable()
export class CreationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ai: AiService,
    private readonly content: ContentService,
    private readonly kanban: KanbanService,
  ) {}

  async generateFromBrief(dto: GenerateBriefPlanDto) {
    const client = await this.prisma.client.findUnique({
      where: { id: dto.clientId },
      select: { id: true, companyName: true },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    const plan = await this.ai.generateContentPlan({
      brief: dto.brief,
      clientName: client.companyName,
      platform: dto.platform,
      objective: dto.objective,
    });

    return {
      clientId: client.id,
      clientName: client.companyName,
      summary: plan.summary,
      platform: toLowerEnum(plan.platform),
      ideas: plan.ideas.map((idea) => ({
        title: idea.title,
        copy: idea.copy,
        format: toLowerEnum(idea.format),
        mediaConcept: idea.mediaConcept,
        suggestedDate: idea.suggestedDate,
      })),
      provider: plan.provider,
    };
  }

  async createFromBriefPlan(userId: string, dto: CreateBriefPlanDto) {
    const client = await this.prisma.client.findUnique({
      where: { id: dto.clientId },
      select: { id: true },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    const createTasks = dto.createKanbanTasks !== false;
    const todoColumnId = createTasks
      ? await this.resolveTodoColumnId()
      : null;

    const posts: Awaited<ReturnType<ContentService['createPost']>>[] = [];
    const tasks: Awaited<ReturnType<KanbanService['createTask']>>[] = [];

    for (const idea of dto.ideas) {
      const scheduledDate = new Date(idea.suggestedDate);
      const hasValidSchedule = !Number.isNaN(scheduledDate.getTime());

      const post = await this.content.createPost(userId, {
        title: idea.title,
        clientId: dto.clientId,
        platform: dto.platform,
        format: idea.format,
        copy: idea.copy,
        scheduledDate: hasValidSchedule ? idea.suggestedDate : undefined,
        status: hasValidSchedule
          ? ContentPostStatus.SCHEDULED
          : ContentPostStatus.DRAFT,
      });
      posts.push(post);

      if (createTasks && todoColumnId) {
        const task = await this.kanban.createTask(userId, {
          title: `Produção: ${idea.title}`,
          description: `Conceito de mídia:\n${idea.mediaConcept}\n\nCopy sugerida:\n${idea.copy}`,
          columnId: todoColumnId,
          clientId: dto.clientId,
          priority: KanbanTaskPriority.MEDIUM,
          dueDate: hasValidSchedule ? idea.suggestedDate : undefined,
        });
        tasks.push(task);
      }
    }

    return {
      created: {
        posts: posts.length,
        tasks: tasks.length,
      },
      posts,
      tasks,
    };
  }

  private async resolveTodoColumnId() {
    const column = await this.prisma.kanbanColumn.findFirst({
      where: { type: KanbanColumnType.TO_DO },
      orderBy: { order: 'asc' },
    });

    if (column) return column.id;

    await this.kanban.getColumns();
    const fallback = await this.prisma.kanbanColumn.findFirst({
      orderBy: { order: 'asc' },
    });

    if (!fallback) {
      throw new NotFoundException('No Kanban columns available');
    }

    return fallback.id;
  }

  async getCommandCenter() {
    const { start: weekStart, end: weekEnd } = getWeekBounds();
    const now = new Date();
    const scheduleHorizon = new Date(now);
    scheduleHorizon.setDate(scheduleHorizon.getDate() + 21);

    const doneColumn = await this.prisma.kanbanColumn.findFirst({
      where: { type: KanbanColumnType.DONE },
      select: { id: true },
    });
    const notDoneFilter = doneColumn
      ? { columnId: { not: doneColumn.id } }
      : {};

    const weekPostWhere: Prisma.ContentPostWhereInput = {
      status: {
        in: [
          ContentPostStatus.DRAFT,
          ContentPostStatus.PENDING_APPROVAL,
          ContentPostStatus.APPROVED,
        ],
      },
      OR: [
        { scheduledDate: { gte: weekStart, lte: weekEnd } },
        { updatedAt: { gte: weekStart, lte: weekEnd } },
      ],
    };

    const weekTaskWhere: Prisma.KanbanTaskWhereInput = {
      ...notDoneFilter,
      OR: [
        { dueDate: { gte: weekStart, lte: weekEnd } },
        { updatedAt: { gte: weekStart, lte: weekEnd } },
      ],
    };

    const [
      weekPosts,
      weekTasks,
      approvalPosts,
      scheduledPosts,
      publishEvents,
      overdueTasks,
      postsMissingAssets,
      unsignedContracts,
    ] = await Promise.all([
      this.prisma.contentPost.findMany({
        where: weekPostWhere,
        select: postSelect,
        orderBy: [{ clientId: 'asc' }, { scheduledDate: 'asc' }, { updatedAt: 'desc' }],
      }),
      this.prisma.kanbanTask.findMany({
        where: weekTaskWhere,
        include: taskInclude,
        orderBy: [{ dueDate: 'asc' }, { updatedAt: 'desc' }],
      }),
      this.prisma.contentPost.findMany({
        where: {
          status: {
            in: [
              ContentPostStatus.PENDING_APPROVAL,
              ContentPostStatus.REJECTED,
            ],
          },
        },
        select: postSelect,
        orderBy: { updatedAt: 'asc' },
        take: 20,
      }),
      this.prisma.contentPost.findMany({
        where: {
          scheduledDate: { gte: now, lte: scheduleHorizon },
          status: {
            in: [
              ContentPostStatus.SCHEDULED,
              ContentPostStatus.APPROVED,
              ContentPostStatus.PENDING_APPROVAL,
            ],
          },
        },
        select: postSelect,
        orderBy: { scheduledDate: 'asc' },
        take: 30,
      }),
      this.prisma.calendarEvent.findMany({
        where: {
          category: EventCategory.PUBLISH,
          startAt: { gte: now, lte: scheduleHorizon },
        },
        include: {
          client: { select: { id: true, companyName: true, avatarUrl: true } },
        },
        orderBy: { startAt: 'asc' },
        take: 20,
      }),
      this.prisma.kanbanTask.findMany({
        where: {
          ...notDoneFilter,
          dueDate: { lt: now },
        },
        include: taskInclude,
        orderBy: { dueDate: 'asc' },
        take: 15,
      }),
      this.prisma.contentPost.findMany({
        where: {
          status: {
            in: [
              ContentPostStatus.DRAFT,
              ContentPostStatus.PENDING_APPROVAL,
            ],
          },
          attachments: { none: {} },
        },
        select: postSelect,
        orderBy: { updatedAt: 'desc' },
        take: 15,
      }),
      this.prisma.contract.findMany({
        where: {
          status: { in: [ContractStatus.DRAFT, ContractStatus.SENT] },
        },
        include: {
          client: { select: { id: true, companyName: true, avatarUrl: true } },
        },
        orderBy: { updatedAt: 'desc' },
        take: 15,
      }),
    ]);

    const deliverableItems = [
      ...weekPosts.map((post) => this.toPostDeliverable(post)),
      ...weekTasks.map((task) => this.toTaskDeliverable(task)),
    ];

    const byClientMap = new Map<
      string,
      {
        clientId: string;
        clientName: string;
        avatarUrl: string | null;
        items: ReturnType<typeof this.toPostDeliverable>[];
      }
    >();

    for (const item of deliverableItems) {
      const key = item.clientId ?? 'unassigned';
      const existing = byClientMap.get(key);
      if (existing) {
        existing.items.push(item);
      } else {
        byClientMap.set(key, {
          clientId: item.clientId ?? 'unassigned',
          clientName: item.clientName,
          avatarUrl: item.clientAvatarUrl,
          items: [item],
        });
      }
    }

    const byFormat: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    for (const item of deliverableItems) {
      if (item.format) {
        byFormat[item.format] = (byFormat[item.format] ?? 0) + 1;
      }
      byStatus[item.status] = (byStatus[item.status] ?? 0) + 1;
    }

    const scheduleItems = [
      ...scheduledPosts.map((post) => ({
        id: post.id,
        type: 'post' as const,
        title: post.title,
        clientId: post.client.id,
        clientName: post.client.companyName,
        platform: toLowerEnum(post.platform),
        format: toLowerEnum(post.format),
        status: toLowerEnum(post.status),
        scheduledAt: post.scheduledDate!.toISOString(),
        color: PLATFORM_COLORS[post.platform] ?? '#004949',
      })),
      ...publishEvents.map((event) => ({
        id: event.id,
        type: 'event' as const,
        title: event.title,
        clientId: event.client?.id ?? null,
        clientName: event.client?.companyName ?? 'Sem cliente',
        platform: null,
        format: null,
        status: event.isPending ? 'pending' : 'confirmed',
        scheduledAt: event.startAt.toISOString(),
        color: event.color ?? '#004949',
        referenceUrl: event.referenceUrl,
      })),
    ].sort(
      (a, b) =>
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
    );

    const blockers = [
      ...overdueTasks.map((task) => ({
        id: `overdue-task-${task.id}`,
        severity: 'red' as const,
        type: 'overdue_task' as const,
        title: task.title,
        description: `Tarefa atrasada · ${task.column.title}`,
        clientId: task.client?.id ?? null,
        clientName: task.client?.companyName ?? 'Sem cliente',
        dueDate: task.dueDate?.toISOString() ?? null,
        href: '/kanban',
      })),
      ...postsMissingAssets.map((post) => ({
        id: `missing-assets-${post.id}`,
        severity: 'amber' as const,
        type: 'missing_assets' as const,
        title: post.title,
        description: 'Post sem mídia ou anexos',
        clientId: post.client.id,
        clientName: post.client.companyName,
        dueDate: post.scheduledDate?.toISOString() ?? null,
        href: `/content/${post.id}`,
      })),
      ...unsignedContracts.map((contract) => ({
        id: `unsigned-contract-${contract.id}`,
        severity: 'red' as const,
        type: 'unsigned_contract' as const,
        title: contract.title,
        description: `Contrato ${toLowerEnum(contract.status)} · ${contract.client.companyName}`,
        clientId: contract.client.id,
        clientName: contract.client.companyName,
        dueDate: contract.startDate.toISOString(),
        href: '/contracts',
      })),
    ];

    return {
      weekRange: {
        start: weekStart.toISOString(),
        end: weekEnd.toISOString(),
      },
      deliverables: {
        groups: Array.from(byClientMap.values()).sort((a, b) =>
          a.clientName.localeCompare(b.clientName, 'pt-BR'),
        ),
        summary: {
          total: deliverableItems.length,
          byFormat,
          byStatus,
        },
      },
      approvalsQueue: approvalPosts.map((post) => ({
        id: post.id,
        title: post.title,
        clientId: post.client.id,
        clientName: post.client.companyName,
        clientAvatarUrl: post.client.avatarUrl,
        platform: toLowerEnum(post.platform),
        format: toLowerEnum(post.format),
        status: toLowerEnum(post.status),
        assignee: post.assignee,
        updatedAt: post.updatedAt.toISOString(),
        scheduledDate: post.scheduledDate?.toISOString() ?? null,
      })),
      publishingSchedule: scheduleItems,
      blockers,
      stats: {
        deliverablesThisWeek: deliverableItems.length,
        pendingApprovals: approvalPosts.filter(
          (p) => p.status === ContentPostStatus.PENDING_APPROVAL,
        ).length,
        scheduledReleases: scheduleItems.length,
        activeBlockers: blockers.length,
      },
    };
  }

  private toPostDeliverable(
    post: Prisma.ContentPostGetPayload<{ select: typeof postSelect }>,
  ) {
    return {
      id: post.id,
      type: 'post' as const,
      title: post.title,
      clientId: post.client.id,
      clientName: post.client.companyName,
      clientAvatarUrl: post.client.avatarUrl,
      format: toLowerEnum(post.format),
      status: toLowerEnum(post.status),
      platform: toLowerEnum(post.platform),
      scheduledDate: post.scheduledDate?.toISOString() ?? null,
      dueDate: post.scheduledDate?.toISOString() ?? null,
      assignee: post.assignee,
      updatedAt: post.updatedAt.toISOString(),
    };
  }

  private toTaskDeliverable(
    task: Prisma.KanbanTaskGetPayload<{ include: typeof taskInclude }>,
  ) {
    return {
      id: task.id,
      type: 'task' as const,
      title: task.title,
      clientId: task.client?.id ?? null,
      clientName: task.client?.companyName ?? 'Sem cliente',
      clientAvatarUrl: task.client?.avatarUrl ?? null,
      format: null,
      status: task.column.type
        ? toLowerEnum(task.column.type)
        : 'in_progress',
      platform: null,
      scheduledDate: null,
      dueDate: task.dueDate?.toISOString() ?? null,
      columnTitle: task.column.title,
      priority: toLowerEnum(task.priority),
      assignees: task.assignees.map((a) => a.user),
      updatedAt: task.updatedAt.toISOString(),
    };
  }
}
