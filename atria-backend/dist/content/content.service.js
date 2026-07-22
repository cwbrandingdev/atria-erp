"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const notifications_service_1 = require("../notifications/notifications.service");
const prisma_service_1 = require("../prisma/prisma.service");
const PLATFORM_COLORS = {
    INSTAGRAM: '#E1306C',
    TIKTOK: '#000000',
    YOUTUBE: '#FF0000',
    LINKEDIN: '#0A66C2',
};
const userSelect = { id: true, name: true, avatarUrl: true };
const clientSelect = {
    id: true,
    companyName: true,
    avatarUrl: true,
    instagram: true,
};
const postInclude = {
    attachments: true,
    user: { select: userSelect },
    assignee: { select: userSelect },
    client: { select: clientSelect },
};
let ContentService = class ContentService {
    prisma;
    notifications;
    constructor(prisma, notifications) {
        this.prisma = prisma;
        this.notifications = notifications;
    }
    async getOverview(clientId) {
        const where = clientId ? { clientId } : {};
        const [drafts, pendingApproval, scheduled, published, total] = await Promise.all([
            this.prisma.contentPost.count({
                where: { ...where, status: client_1.ContentPostStatus.DRAFT },
            }),
            this.prisma.contentPost.count({
                where: { ...where, status: client_1.ContentPostStatus.PENDING_APPROVAL },
            }),
            this.prisma.contentPost.count({
                where: { ...where, status: client_1.ContentPostStatus.SCHEDULED },
            }),
            this.prisma.contentPost.count({
                where: { ...where, status: client_1.ContentPostStatus.PUBLISHED },
            }),
            this.prisma.contentPost.count({ where }),
        ]);
        return { drafts, pendingApproval, scheduled, published, total };
    }
    async getCalendarOverview(from, to, clientId) {
        const where = {
            scheduledDate: { not: null },
            status: {
                in: [
                    client_1.ContentPostStatus.SCHEDULED,
                    client_1.ContentPostStatus.PUBLISHED,
                    client_1.ContentPostStatus.PENDING_APPROVAL,
                ],
            },
        };
        if (clientId)
            where.clientId = clientId;
        if (from || to) {
            where.scheduledDate = {};
            if (from)
                where.scheduledDate.gte = new Date(from);
            if (to)
                where.scheduledDate.lte = new Date(to);
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
            scheduledDate: post.scheduledDate.toISOString(),
            status: post.status.toLowerCase(),
            clientName: post.client.companyName,
            color: PLATFORM_COLORS[post.platform] ?? '#004949',
        }));
    }
    async getPosts(query) {
        const where = {};
        if (query.clientId)
            where.clientId = query.clientId;
        if (query.platform)
            where.platform = query.platform;
        if (query.status)
            where.status = query.status;
        if (query.from || query.to) {
            where.scheduledDate = {};
            if (query.from)
                where.scheduledDate.gte = new Date(query.from);
            if (query.to)
                where.scheduledDate.lte = new Date(query.to);
        }
        const posts = await this.prisma.contentPost.findMany({
            where,
            include: postInclude,
            orderBy: [{ scheduledDate: 'asc' }, { createdAt: 'desc' }],
        });
        return posts.map((post) => this.toPostResponse(post));
    }
    async createPost(userId, dto) {
        await this.ensureClientExists(dto.clientId);
        if (dto.assigneeId)
            await this.ensureUserExists(dto.assigneeId);
        const status = dto.status ?? client_1.ContentPostStatus.DRAFT;
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
        if (status === client_1.ContentPostStatus.PENDING_APPROVAL) {
            await this.notifyPostPending(post);
        }
        return this.toPostResponse(post);
    }
    async updatePost(id, dto) {
        const existing = await this.ensurePostExists(id);
        if (dto.clientId)
            await this.ensureClientExists(dto.clientId);
        if (dto.assigneeId)
            await this.ensureUserExists(dto.assigneeId);
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
                scheduledDate: dto.scheduledDate !== undefined
                    ? dto.scheduledDate
                        ? new Date(dto.scheduledDate)
                        : null
                    : undefined,
                status: dto.status,
                copy: dto.copy,
                assigneeId: dto.assigneeId !== undefined ? dto.assigneeId : undefined,
                attachments: dto.attachments?.length
                    ? { create: dto.attachments }
                    : undefined,
            },
            include: postInclude,
        });
        if (dto.status === client_1.ContentPostStatus.PENDING_APPROVAL &&
            existing.status !== client_1.ContentPostStatus.PENDING_APPROVAL) {
            await this.notifyPostPending(post);
        }
        return this.toPostResponse(post);
    }
    async notifyPostPending(post) {
        const recipients = [];
        if (post.assigneeId)
            recipients.push(post.assigneeId);
        if (post.userId)
            recipients.push(post.userId);
        await this.notifications.notifyPostPending(recipients, post.title, post.client.companyName);
    }
    async deletePost(id) {
        await this.ensurePostExists(id);
        await this.prisma.contentPost.delete({ where: { id } });
    }
    async ensureClientExists(id) {
        const client = await this.prisma.client.findUnique({ where: { id } });
        if (!client)
            throw new common_1.NotFoundException('Client not found');
        return client;
    }
    async ensureUserExists(id) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async ensurePostExists(id) {
        const post = await this.prisma.contentPost.findUnique({ where: { id } });
        if (!post)
            throw new common_1.NotFoundException('Content post not found');
        return post;
    }
    toPostResponse(post) {
        return {
            id: post.id,
            title: post.title,
            clientId: post.clientId,
            client: post.client,
            platform: post.platform.toLowerCase(),
            format: post.format.toLowerCase(),
            scheduledDate: post.scheduledDate?.toISOString() ?? null,
            status: post.status.toLowerCase(),
            copy: post.copy,
            attachments: post.attachments,
            author: post.user,
            assignee: post.assignee,
            platformColor: PLATFORM_COLORS[post.platform] ?? '#004949',
            createdAt: post.createdAt.toISOString(),
            updatedAt: post.updatedAt.toISOString(),
        };
    }
};
exports.ContentService = ContentService;
exports.ContentService = ContentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], ContentService);
//# sourceMappingURL=content.service.js.map