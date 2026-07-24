import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  KanbanColumn,
  KanbanColumnType,
  KanbanTaskPriority,
  Prisma,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { DEFAULT_KANBAN_COLUMNS } from './kanban-defaults';
import { CreateCommentDto } from './dto/comment.dto';
import {
  CreateColumnDto,
  ReorderColumnsDto,
  UpdateColumnDto,
} from './dto/column.dto';
import {
  CreateTaskDto,
  MoveTaskDto,
  QueryTasksDto,
  UpdateTaskDto,
} from './dto/task.dto';

const userSelect = { id: true, name: true, avatarUrl: true } as const;

const clientSelect = {
  id: true,
  companyName: true,
  avatarUrl: true,
} as const;

const taskInclude = {
  column: true,
  client: { select: clientSelect },
  createdBy: { select: userSelect },
  assignees: { include: { user: { select: userSelect } } },
} satisfies Prisma.KanbanTaskInclude;

type TaskWithRelations = Prisma.KanbanTaskGetPayload<{
  include: typeof taskInclude;
}>;

const PRIORITY_LABELS: Record<KanbanTaskPriority, string> = {
  CRITICAL: 'Crítica',
  HIGH: 'Alta',
  MEDIUM: 'Média',
  LOW: 'Baixa',
  PLANNED: 'Planejado',
};

@Injectable()
export class KanbanService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  async getColumns() {
    await this.ensureDefaultColumns();

    const columns = await this.prisma.kanbanColumn.findMany({
      orderBy: { order: 'asc' },
    });

    return columns.map((column) => this.toColumnResponse(column));
  }

  async createColumn(dto: CreateColumnDto) {
    const maxOrder = await this.prisma.kanbanColumn.aggregate({
      _max: { order: true },
    });

    const column = await this.prisma.kanbanColumn.create({
      data: {
        title: dto.title,
        color: dto.color ?? '#004949',
        type: KanbanColumnType.CUSTOM,
        order: (maxOrder._max.order ?? 0) + 1,
      },
    });

    return this.toColumnResponse(column);
  }

  async updateColumn(id: string, dto: UpdateColumnDto) {
    await this.ensureColumnExists(id);

    const column = await this.prisma.kanbanColumn.update({
      where: { id },
      data: dto,
    });

    return this.toColumnResponse(column);
  }

  async deleteColumn(id: string) {
    await this.ensureColumnExists(id);

    const taskCount = await this.prisma.kanbanTask.count({
      where: { columnId: id },
    });

    if (taskCount > 0) {
      throw new BadRequestException(
        'Cannot delete a column that contains tasks',
      );
    }

    await this.prisma.kanbanColumn.delete({ where: { id } });
  }

  async reorderColumns(dto: ReorderColumnsDto) {
    await this.prisma.$transaction(
      dto.items.map((item) =>
        this.prisma.kanbanColumn.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );

    return this.getColumns();
  }

  async getTasks(query: QueryTasksDto) {
    const where: Prisma.KanbanTaskWhereInput = {};
    if (query.columnId) where.columnId = query.columnId;
    if (query.clientId) where.clientId = query.clientId;

    const tasks = await this.prisma.kanbanTask.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      include: this.taskInclude(),
      orderBy: [{ columnId: 'asc' }, { order: 'asc' }],
    });

    const taskIds = tasks.map((t) => t.id);
    const aggregates =
      taskIds.length > 0
        ? await this.prisma.timeLog.groupBy({
            by: ['taskId'],
            where: {
              taskId: { in: taskIds },
              durationInSeconds: { not: null },
            },
            _sum: { durationInSeconds: true },
          })
        : [];

    const secondsByTask = new Map(
      aggregates.map((a) => [a.taskId, a._sum.durationInSeconds ?? 0]),
    );

    return tasks.map((task) =>
      this.toTaskResponse(task, secondsByTask.get(task.id) ?? 0),
    );
  }

  async getTask(id: string) {
    const task = await this.ensureTaskExists(id);
    const total = await this.getTaskLoggedSeconds(id);
    return this.toTaskResponse(task, total);
  }

  async createTask(userId: string, dto: CreateTaskDto) {
    await this.ensureColumnExists(dto.columnId);
    await this.validateAssignees(dto.assigneeIds);
    if (dto.clientId) await this.ensureClientExists(dto.clientId);

    const maxOrder = await this.prisma.kanbanTask.aggregate({
      where: { columnId: dto.columnId },
      _max: { order: true },
    });

    const task = await this.prisma.kanbanTask.create({
      data: {
        title: dto.title,
        description: dto.description,
        columnId: dto.columnId,
        clientId: dto.clientId,
        referenceUrl: dto.referenceUrl,
        priority: dto.priority ?? KanbanTaskPriority.MEDIUM,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        createdById: userId,
        order: (maxOrder._max.order ?? -1) + 1,
        assignees: dto.assigneeIds?.length
          ? {
              create: dto.assigneeIds.map((assigneeId) => ({
                userId: assigneeId,
              })),
            }
          : undefined,
      },
      include: this.taskInclude(),
    });

    await this.logHistory(userId, task.id, 'Tarefa criada');

    if (dto.assigneeIds?.length) {
      const names = task.assignees.map((a) => a.user.name).join(', ');
      await this.logHistory(userId, task.id, `Atribuída a ${names}`);
      await this.notifications.notifyTaskAssigned(
        dto.assigneeIds,
        task.title,
        userId,
      );
    }

    return this.toTaskResponse(task, 0);
  }

  async updateTask(userId: string, id: string, dto: UpdateTaskDto) {
    const existing = await this.ensureTaskExists(id);

    if (dto.columnId) {
      await this.ensureColumnExists(dto.columnId);
    }

    if (dto.assigneeIds) {
      await this.validateAssignees(dto.assigneeIds);
    }

    if (dto.clientId !== undefined && dto.clientId !== null) {
      await this.ensureClientExists(dto.clientId);
    }

    const task = await this.prisma.$transaction(async (tx) => {
      if (dto.assigneeIds) {
        await tx.kanbanTaskAssignee.deleteMany({ where: { taskId: id } });
        if (dto.assigneeIds.length > 0) {
          await tx.kanbanTaskAssignee.createMany({
            data: dto.assigneeIds.map((assigneeId) => ({
              taskId: id,
              userId: assigneeId,
            })),
          });
        }
      }

      return tx.kanbanTask.update({
        where: { id },
        data: {
          title: dto.title,
          description: dto.description,
          columnId: dto.columnId,
          clientId: dto.clientId,
          referenceUrl:
            dto.referenceUrl !== undefined ? dto.referenceUrl : undefined,
          priority: dto.priority,
          order: dto.order,
          dueDate:
            dto.dueDate !== undefined
              ? dto.dueDate
                ? new Date(dto.dueDate)
                : null
              : undefined,
        },
        include: this.taskInclude(),
      });
    });

    await this.logTaskChanges(userId, existing, task, dto);

    const total = await this.getTaskLoggedSeconds(id);
    return this.toTaskResponse(task, total);
  }

  async moveTask(userId: string, id: string, dto: MoveTaskDto) {
    const task = await this.ensureTaskExists(id);
    const targetColumn = await this.ensureColumnExists(dto.columnId);

    if (task.columnId !== dto.columnId) {
      await this.prisma.kanbanTask.updateMany({
        where: {
          columnId: dto.columnId,
          order: { gte: dto.order },
          id: { not: id },
        },
        data: { order: { increment: 1 } },
      });
    }

    const updated = await this.prisma.kanbanTask.update({
      where: { id },
      data: { columnId: dto.columnId, order: dto.order },
      include: this.taskInclude(),
    });

    if (task.columnId !== dto.columnId) {
      await this.logHistory(
        userId,
        id,
        `Movida para ${targetColumn.title}`,
      );
    }

    const total = await this.getTaskLoggedSeconds(id);
    return this.toTaskResponse(updated, total);
  }

  async deleteTask(id: string) {
    await this.ensureTaskExists(id);
    await this.prisma.kanbanTask.delete({ where: { id } });
  }

  async getComments(taskId: string) {
    await this.ensureTaskExists(taskId);

    const comments = await this.prisma.taskComment.findMany({
      where: { taskId },
      include: { user: { select: userSelect } },
      orderBy: { createdAt: 'asc' },
    });

    return comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      user: comment.user,
    }));
  }

  async createComment(
    userId: string,
    taskId: string,
    dto: CreateCommentDto,
  ) {
    await this.ensureTaskExists(taskId);

    const comment = await this.prisma.taskComment.create({
      data: {
        taskId,
        userId,
        content: dto.content,
      },
      include: { user: { select: userSelect } },
    });

    await this.logHistory(userId, taskId, 'Comentário adicionado');

    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      user: comment.user,
    };
  }

  async getHistory(taskId: string) {
    await this.ensureTaskExists(taskId);

    const history = await this.prisma.taskHistory.findMany({
      where: { taskId },
      include: { user: { select: userSelect } },
      orderBy: { createdAt: 'desc' },
    });

    return history.map((entry) => ({
      id: entry.id,
      action: entry.action,
      createdAt: entry.createdAt.toISOString(),
      user: entry.user,
    }));
  }

  private async ensureDefaultColumns() {
    const count = await this.prisma.kanbanColumn.count();
    if (count > 0) return;

    await this.prisma.$transaction(async (tx) => {
      const innerCount = await tx.kanbanColumn.count();
      if (innerCount > 0) return;

      await tx.kanbanColumn.createMany({
        data: DEFAULT_KANBAN_COLUMNS.map((column) => ({ ...column })),
      });
    });
  }

  private taskInclude() {
    return taskInclude;
  }

  private async ensureColumnExists(id: string) {
    const column = await this.prisma.kanbanColumn.findUnique({
      where: { id },
    });
    if (!column) throw new NotFoundException('Column not found');
    return column;
  }

  private async ensureTaskExists(id: string): Promise<TaskWithRelations> {
    const task = await this.prisma.kanbanTask.findUnique({
      where: { id },
      include: this.taskInclude(),
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  private async validateAssignees(assigneeIds?: string[]) {
    if (!assigneeIds?.length) return;

    const users = await this.prisma.user.findMany({
      where: { id: { in: assigneeIds } },
      select: { id: true },
    });

    if (users.length !== assigneeIds.length) {
      throw new BadRequestException('One or more assignees were not found');
    }
  }

  private async ensureClientExists(clientId: string) {
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });
    if (!client) throw new NotFoundException('Client not found');
  }

  private async getTaskLoggedSeconds(taskId: string) {
    const result = await this.prisma.timeLog.aggregate({
      where: { taskId, durationInSeconds: { not: null } },
      _sum: { durationInSeconds: true },
    });
    return result._sum.durationInSeconds ?? 0;
  }

  private async logHistory(userId: string, taskId: string, action: string) {
    await this.prisma.taskHistory.create({
      data: { userId, taskId, action },
    });
  }

  private async logTaskChanges(
    userId: string,
    before: TaskWithRelations,
    after: TaskWithRelations,
    dto: UpdateTaskDto,
  ) {
    const logs: string[] = [];

    if (dto.title && dto.title !== before.title) {
      logs.push(`Título atualizado para "${dto.title}"`);
    }

    if (dto.priority && dto.priority !== before.priority) {
      logs.push(
        `Prioridade alterada para ${PRIORITY_LABELS[dto.priority]}`,
      );
    }

    if (dto.columnId && dto.columnId !== before.columnId) {
      logs.push(`Movida para ${after.column.title}`);
    }

    if (dto.assigneeIds) {
      const beforeIds = before.assignees.map((a) => a.user.id).sort();
      const afterIds = after.assignees.map((a) => a.user.id).sort();
      if (beforeIds.join(',') !== afterIds.join(',')) {
        const names =
          after.assignees.map((a) => a.user.name).join(', ') || 'ninguém';
        logs.push(`Responsáveis atualizados: ${names}`);

        const newAssignees = afterIds.filter((id) => !beforeIds.includes(id));
        if (newAssignees.length > 0) {
          await this.notifications.notifyTaskAssigned(
            newAssignees,
            after.title,
            userId,
          );
        }
      }
    }

    if (dto.dueDate !== undefined) {
      logs.push('Data de prazo atualizada');
    }

    for (const action of logs) {
      await this.logHistory(userId, before.id, action);
    }
  }

  private toColumnResponse(column: KanbanColumn) {
    return {
      id: column.id,
      title: column.title,
      order: column.order,
      color: column.color,
      type: column.type
        ? (column.type.toLowerCase() as
            | 'to_do'
            | 'in_progress'
            | 'done'
            | 'custom')
        : null,
    };
  }

  private toTaskResponse(task: TaskWithRelations, totalLoggedSeconds: number) {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      referenceUrl: task.referenceUrl,
      columnId: task.columnId,
      column: this.toColumnResponse(task.column),
      clientId: task.clientId,
      client: task.client,
      priority: task.priority.toLowerCase() as
        | 'critical'
        | 'high'
        | 'medium'
        | 'low'
        | 'planned',
      order: task.order,
      dueDate: task.dueDate?.toISOString() ?? null,
      assignees: task.assignees.map((a) => a.user),
      createdBy: task.createdBy,
      totalLoggedSeconds,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    };
  }
}
