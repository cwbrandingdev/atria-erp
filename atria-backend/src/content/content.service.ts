import { Injectable, NotFoundException } from '@nestjs/common';
import { ContentPostStatus, Prisma } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateContentPostDto,
  QueryContentPostsDto,
  UpdateContentPostDto,
} from './dto/content-post.dto';

const PLATFORM_COLORS: Record<string, string> = {
  INSTAGRAM: '#E1306C',
  TIKTOK: '#000000',
  YOUTUBE: '#FF0000',
  LINKEDIN: '#0A66C2',
};

const userSelect = { id: true, name: true, avatarUrl: true } as const;

const clientSelect = {
  id: true,
  companyName: true,
  avatarUrl: true,
  instagram: true,
} as const;

const postInclude = {
  attachments: true,
  user: { select: userSelect },
  assignee: { select: userSelect },
  client: { select: clientSelect },
} satisfies Prisma.ContentPostInclude;

type PostWithRelations = Prisma.ContentPostGetPayload<{
  include: typeof postInclude;
}>;

@Injectable()
export class ContentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  async getOverview(clientId?: string) {
    const where: Prisma.ContentPostWhereInput = clientId ? { clientId } : {};

    const [drafts, pendingApproval, scheduled, published, total] =
      await Promise.all([
        this.prisma.contentPost.count({
          where: { ...where, status: ContentPostStatus.DRAFT },
        }),
        this.prisma.contentPost.count({
          where: { ...where, status: ContentPostStatus.PENDING_APPROVAL },
        }),
        this.prisma.contentPost.count({
          where: { ...where, status: ContentPostStatus.SCHEDULED },
        }),
        this.prisma.contentPost.count({
          where: { ...where, status: ContentPostStatus.PUBLISHED },
        }),
        this.prisma.contentPost.count({ where }),
      ]);

    return { drafts, pendingApproval, scheduled, published, total };
  }

  async getCalendarOverview(from?: string, to?: string, clientId?: string) {
    const where: Prisma.ContentPostWhereInput = {
      scheduledDate: { not: null },
      status: {
        in: [
          ContentPostStatus.SCHEDULED,
          ContentPostStatus.PUBLISHED,
          ContentPostStatus.PENDING_APPROVAL,
        ],
      },
    };

    if (clientId) where.clientId = clientId;

    if (from || to) {
      where.scheduledDate = {};
      if (from) where.scheduledDate.gte = new Date(from);
      if (to) where.scheduledDate.lte = new Date(to);
    }

    const posts = await this.prisma.contentPost.findMany({
      where,
      select: {
        id: true,
        title: true,
        platform: true,
        scheduledDate: true,
        status: true,
        client: { select: { companyName: true } },
      },
      orderBy: { scheduledDate: 'asc' },
    });

    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      platform: post.platform.toLowerCase(),
      scheduledDate: post.scheduledDate!.toISOString(),
      status: post.status.toLowerCase(),
      clientName: post.client.companyName,
      color: PLATFORM_COLORS[post.platform] ?? '#004949',
    }));
  }

  async getPosts(query: QueryContentPostsDto) {
    const where: Prisma.ContentPostWhereInput = {};

    if (query.clientId) where.clientId = query.clientId;
    if (query.platform) where.platform = query.platform;
    if (query.status) where.status = query.status;

    if (query.from || query.to) {
      where.scheduledDate = {};
      if (query.from) where.scheduledDate.gte = new Date(query.from);
      if (query.to) where.scheduledDate.lte = new Date(query.to);
    }

    const posts = await this.prisma.contentPost.findMany({
      where,
      include: postInclude,
      orderBy: [{ scheduledDate: 'asc' }, { createdAt: 'desc' }],
    });

    return posts.map((post) => this.toPostResponse(post));
  }

  async createPost(userId: string, dto: CreateContentPostDto) {
    await this.ensureClientExists(dto.clientId);
    if (dto.assigneeId) await this.ensureUserExists(dto.assigneeId);

    const status = dto.status ?? ContentPostStatus.DRAFT;

    const post = await this.prisma.contentPost.create({
      data: {
        title: dto.title,
        clientId: dto.clientId,
        platform: dto.platform,
        format: dto.format,
        scheduledDate: dto.scheduledDate
          ? new Date(dto.scheduledDate)
          : null,
        status,
        copy: dto.copy,
        userId,
        assigneeId: dto.assigneeId,
        attachments: dto.attachments?.length
          ? { create: dto.attachments }
          : undefined,
      },
      include: postInclude,
    });

    if (status === ContentPostStatus.PENDING_APPROVAL) {
      await this.notifyPostPending(post);
    }

    return this.toPostResponse(post);
  }

  async updatePost(id: string, dto: UpdateContentPostDto) {
    const existing = await this.ensurePostExists(id);
    if (dto.clientId) await this.ensureClientExists(dto.clientId);
    if (dto.assigneeId) await this.ensureUserExists(dto.assigneeId);

    if (dto.attachments !== undefined) {
      await this.prisma.contentAttachment.deleteMany({ where: { postId: id } });
    }

    const post = await this.prisma.contentPost.update({
      where: { id },
      data: {
        title: dto.title,
        clientId: dto.clientId,
        platform: dto.platform,
        format: dto.format,
        scheduledDate:
          dto.scheduledDate !== undefined
            ? dto.scheduledDate
              ? new Date(dto.scheduledDate)
              : null
            : undefined,
        status: dto.status,
        copy: dto.copy,
        assigneeId:
          dto.assigneeId !== undefined ? dto.assigneeId : undefined,
        attachments: dto.attachments?.length
          ? { create: dto.attachments }
          : undefined,
      },
      include: postInclude,
    });

    if (
      dto.status === ContentPostStatus.PENDING_APPROVAL &&
      existing.status !== ContentPostStatus.PENDING_APPROVAL
    ) {
      await this.notifyPostPending(post);
    }

    return this.toPostResponse(post);
  }

  private async notifyPostPending(
    post: PostWithRelations,
  ) {
    const recipients: string[] = [];
    if (post.assigneeId) recipients.push(post.assigneeId);
    if (post.userId) recipients.push(post.userId);

    await this.notifications.notifyPostPending(
      recipients,
      post.title,
      post.client.companyName,
    );
  }

  async deletePost(id: string) {
    await this.ensurePostExists(id);
    await this.prisma.contentPost.delete({ where: { id } });
  }

  private async ensureClientExists(id: string) {
    const client = await this.prisma.client.findUnique({ where: { id } });
    if (!client) throw new NotFoundException('Client not found');
    return client;
  }

  private async ensureUserExists(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  private async ensurePostExists(id: string) {
    const post = await this.prisma.contentPost.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Content post not found');
    return post;
  }

  private toPostResponse(post: PostWithRelations) {
    return {
      id: post.id,
      title: post.title,
      clientId: post.clientId,
      client: post.client,
      platform: post.platform.toLowerCase() as
        | 'instagram'
        | 'tiktok'
        | 'youtube'
        | 'linkedin',
      format: post.format.toLowerCase() as
        | 'carousel'
        | 'reels'
        | 'static'
        | 'story',
      scheduledDate: post.scheduledDate?.toISOString() ?? null,
      status: post.status.toLowerCase() as
        | 'draft'
        | 'pending_approval'
        | 'scheduled'
        | 'published',
      copy: post.copy,
      attachments: post.attachments,
      author: post.user,
      assignee: post.assignee,
      platformColor: PLATFORM_COLORS[post.platform] ?? '#004949',
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  }
}
