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
exports.PortalService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const crypto_1 = require("crypto");
const assets_service_1 = require("../assets/assets.service");
const contracts_service_1 = require("../contracts/contracts.service");
const integrations_service_1 = require("../integrations/integrations.service");
const notifications_service_1 = require("../notifications/notifications.service");
const prisma_service_1 = require("../prisma/prisma.service");
const MONTH_NAMES = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
];
const clientSelect = {
    id: true,
    companyName: true,
    contactName: true,
    email: true,
    avatarUrl: true,
    instagram: true,
};
const reportInclude = {
    client: { select: clientSelect },
    generatedBy: { select: { id: true, name: true, avatarUrl: true } },
};
const PORTAL_TOKEN_TTL_DAYS = 365;
let PortalService = class PortalService {
    prisma;
    contractsService;
    assetsService;
    notifications;
    integrations;
    constructor(prisma, contractsService, assetsService, notifications, integrations) {
        this.prisma = prisma;
        this.contractsService = contractsService;
        this.assetsService = assetsService;
        this.notifications = notifications;
        this.integrations = integrations;
    }
    async generatePortalToken(clientId) {
        const client = await this.prisma.client.findUnique({
            where: { id: clientId },
            select: { id: true, companyName: true },
        });
        if (!client)
            throw new common_1.NotFoundException('Client not found');
        const rawToken = (0, crypto_1.randomBytes)(32).toString('hex');
        const tokenHash = this.hashToken(rawToken);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + PORTAL_TOKEN_TTL_DAYS);
        await this.prisma.clientPortalToken.upsert({
            where: { clientId },
            create: { clientId, tokenHash, isActive: true, expiresAt },
            update: {
                tokenHash,
                isActive: true,
                expiresAt,
                lastAccessedAt: null,
            },
        });
        return {
            clientId: client.id,
            companyName: client.companyName,
            token: rawToken,
            portalUrl: `/portal/${rawToken}`,
        };
    }
    async getPortalData(rawToken) {
        const portalToken = await this.resolvePortalToken(rawToken);
        await this.prisma.clientPortalToken.update({
            where: { id: portalToken.id },
            data: { lastAccessedAt: new Date() },
        });
        const clientId = portalToken.clientId;
        const [client, pendingPosts, scheduledPosts, reports, contracts, overview, recentBriefs,] = await Promise.all([
            this.prisma.client.findUnique({
                where: { id: clientId },
                select: clientSelect,
            }),
            this.prisma.contentPost.findMany({
                where: { clientId, status: client_1.ContentPostStatus.PENDING_APPROVAL },
                orderBy: { scheduledDate: 'asc' },
                take: 30,
                include: { attachments: true },
            }),
            this.prisma.contentPost.findMany({
                where: { clientId, status: client_1.ContentPostStatus.SCHEDULED },
                orderBy: { scheduledDate: 'asc' },
                take: 15,
                include: { attachments: true },
            }),
            this.prisma.clientReport.findMany({
                where: { clientId },
                orderBy: [{ year: 'desc' }, { month: 'desc' }],
                take: 12,
                select: {
                    id: true,
                    title: true,
                    month: true,
                    year: true,
                    createdAt: true,
                },
            }),
            this.prisma.contract.findMany({
                where: { clientId },
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    title: true,
                    status: true,
                    recurringValue: true,
                    paymentFrequency: true,
                    startDate: true,
                    endDate: true,
                    pdfUrl: true,
                    termsContent: true,
                },
            }),
            this.getContentOverview(clientId),
            this.prisma.clientBrief.findMany({
                where: { clientId },
                orderBy: { createdAt: 'desc' },
                take: 5,
                select: {
                    id: true,
                    title: true,
                    content: true,
                    createdAt: true,
                },
            }),
        ]);
        const signedContracts = contracts.filter((c) => c.status === client_1.ContractStatus.SIGNED);
        return {
            client,
            accountStatus: {
                activeContracts: signedContracts.length,
                pendingApprovals: overview.pendingApproval,
                scheduledPosts: overview.scheduled,
                publishedPosts: overview.published,
                status: signedContracts.length > 0
                    ? 'active'
                    : 'onboarding',
            },
            pendingApprovalPosts: pendingPosts.map((p) => this.toPortalPost(p)),
            scheduledPosts: scheduledPosts.map((p) => this.toPortalPost(p)),
            recentReports: reports.map((r) => ({
                id: r.id,
                title: r.title,
                month: r.month,
                year: r.year,
                periodLabel: `${MONTH_NAMES[r.month - 1]} ${r.year}`,
                createdAt: r.createdAt.toISOString(),
            })),
            contracts: contracts.map((c) => ({
                id: c.id,
                title: c.title,
                status: c.status.toLowerCase(),
                recurringValue: Number(c.recurringValue),
                paymentFrequency: c.paymentFrequency.toLowerCase(),
                startDate: c.startDate.toISOString(),
                endDate: c.endDate?.toISOString() ?? null,
                pdfUrl: c.pdfUrl,
                hasTerms: Boolean(c.termsContent?.trim()),
            })),
            recentBriefs: recentBriefs.map((b) => ({
                id: b.id,
                title: b.title,
                content: b.content,
                createdAt: b.createdAt.toISOString(),
            })),
        };
    }
    async getPortalReport(rawToken, reportId) {
        const portalToken = await this.resolvePortalToken(rawToken);
        const report = await this.prisma.clientReport.findFirst({
            where: { id: reportId, clientId: portalToken.clientId },
            include: reportInclude,
        });
        if (!report)
            throw new common_1.NotFoundException('Report not found');
        return {
            id: report.id,
            clientId: report.clientId,
            client: report.client,
            month: report.month,
            year: report.year,
            title: report.title,
            data: report.data,
            generatedBy: report.generatedBy,
            createdAt: report.createdAt.toISOString(),
        };
    }
    async getPortalPost(rawToken, postId) {
        const { clientId } = await this.resolvePortalToken(rawToken);
        const post = await this.prisma.contentPost.findFirst({
            where: { id: postId, clientId },
            include: {
                attachments: true,
                versions: {
                    orderBy: { versionNumber: 'desc' },
                    take: 5,
                    include: {
                        createdBy: { select: { id: true, name: true, avatarUrl: true } },
                    },
                },
            },
        });
        if (!post)
            throw new common_1.NotFoundException('Post not found');
        return this.toPortalPostDetail(post);
    }
    async approvePortalPost(rawToken, postId) {
        const { clientId } = await this.resolvePortalToken(rawToken);
        const post = await this.prisma.contentPost.findFirst({
            where: {
                id: postId,
                clientId,
                status: client_1.ContentPostStatus.PENDING_APPROVAL,
            },
        });
        if (!post) {
            throw new common_1.NotFoundException('Post not found or not pending approval');
        }
        const updated = await this.prisma.contentPost.update({
            where: { id: postId },
            data: { status: client_1.ContentPostStatus.APPROVED },
            include: { attachments: true },
        });
        return this.toPortalPost(updated);
    }
    async rejectPortalPost(rawToken, postId, dto) {
        const { clientId } = await this.resolvePortalToken(rawToken);
        const post = await this.prisma.contentPost.findFirst({
            where: {
                id: postId,
                clientId,
                status: client_1.ContentPostStatus.PENDING_APPROVAL,
            },
        });
        if (!post) {
            throw new common_1.NotFoundException('Post not found or not pending approval');
        }
        const latestVersion = await this.prisma.postVersion.findFirst({
            where: { postId },
            orderBy: { versionNumber: 'desc' },
            select: { id: true },
        });
        const feedbackUserId = post.assigneeId ?? post.userId;
        const [updated] = await this.prisma.$transaction([
            this.prisma.contentPost.update({
                where: { id: postId },
                data: { status: client_1.ContentPostStatus.REJECTED },
                include: {
                    attachments: true,
                    client: { select: { companyName: true } },
                },
            }),
            this.prisma.postFeedback.create({
                data: {
                    postId,
                    versionId: latestVersion?.id,
                    userId: feedbackUserId,
                    comment: `[Cliente via Portal] ${dto.rejectionReason}`,
                    type: client_1.PostFeedbackType.REJECTION_REASON,
                },
            }),
        ]);
        const recipients = [post.assigneeId, post.userId].filter((uid) => Boolean(uid));
        await this.notifications.notifyPostRejected(recipients, updated.title, updated.client.companyName, dto.rejectionReason);
        await this.integrations.notifyPostRejected({
            postTitle: updated.title,
            clientName: updated.client.companyName,
            reason: dto.rejectionReason,
            source: 'portal',
            postId: updated.id,
        });
        return this.toPortalPost(updated);
    }
    async getPortalContract(rawToken, contractId) {
        const { clientId } = await this.resolvePortalToken(rawToken);
        const contract = await this.prisma.contract.findFirst({
            where: { id: contractId, clientId },
            include: {
                client: {
                    select: {
                        id: true,
                        companyName: true,
                        contactName: true,
                        email: true,
                        phone: true,
                        street: true,
                        number: true,
                        city: true,
                        state: true,
                        zipCode: true,
                        avatarUrl: true,
                    },
                },
                createdBy: {
                    select: { id: true, name: true, email: true, avatarUrl: true },
                },
            },
        });
        if (!contract)
            throw new common_1.NotFoundException('Contract not found');
        return {
            id: contract.id,
            clientId: contract.clientId,
            client: contract.client,
            title: contract.title,
            status: contract.status.toLowerCase(),
            recurringValue: Number(contract.recurringValue),
            paymentFrequency: contract.paymentFrequency.toLowerCase(),
            startDate: contract.startDate.toISOString(),
            endDate: contract.endDate?.toISOString() ?? null,
            termsContent: contract.termsContent,
            pdfUrl: contract.pdfUrl,
            createdBy: contract.createdBy,
            createdAt: contract.createdAt.toISOString(),
            updatedAt: contract.updatedAt.toISOString(),
        };
    }
    async signPortalContract(rawToken, contractId) {
        const { clientId } = await this.resolvePortalToken(rawToken);
        const contract = await this.prisma.contract.findFirst({
            where: { id: contractId, clientId },
            select: { id: true, createdById: true, status: true },
        });
        if (!contract)
            throw new common_1.NotFoundException('Contract not found');
        if (contract.status === client_1.ContractStatus.SIGNED) {
            throw new common_1.BadRequestException('Contract is already signed');
        }
        if (contract.status !== client_1.ContractStatus.SENT &&
            contract.status !== client_1.ContractStatus.DRAFT) {
            throw new common_1.BadRequestException('Contract cannot be signed');
        }
        return this.contractsService.signContract(contract.createdById, contractId, 'portal');
    }
    async uploadPortalAsset(rawToken, file, fileType) {
        const { clientId } = await this.resolvePortalToken(rawToken);
        return this.assetsService.upload(null, {
            clientId,
            fileType: (fileType?.toUpperCase() ?? 'DOCUMENT'),
        }, file);
    }
    async createBriefing(rawToken, dto) {
        const { clientId } = await this.resolvePortalToken(rawToken);
        const brief = await this.prisma.clientBrief.create({
            data: {
                clientId,
                title: dto.title,
                content: dto.content,
                source: 'portal',
            },
        });
        return {
            id: brief.id,
            title: brief.title,
            content: brief.content,
            createdAt: brief.createdAt.toISOString(),
        };
    }
    async resolvePortalToken(rawToken) {
        const tokenHash = this.hashToken(rawToken);
        const portalToken = await this.prisma.clientPortalToken.findFirst({
            where: { tokenHash, isActive: true },
        });
        if (!portalToken) {
            throw new common_1.UnauthorizedException('Invalid or revoked portal token');
        }
        if (portalToken.expiresAt && portalToken.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Portal token has expired');
        }
        return portalToken;
    }
    hashToken(rawToken) {
        return (0, crypto_1.createHash)('sha256').update(rawToken).digest('hex');
    }
    async getContentOverview(clientId) {
        const [pendingApproval, scheduled, published] = await Promise.all([
            this.prisma.contentPost.count({
                where: { clientId, status: client_1.ContentPostStatus.PENDING_APPROVAL },
            }),
            this.prisma.contentPost.count({
                where: { clientId, status: client_1.ContentPostStatus.SCHEDULED },
            }),
            this.prisma.contentPost.count({
                where: { clientId, status: client_1.ContentPostStatus.PUBLISHED },
            }),
        ]);
        return { pendingApproval, scheduled, published };
    }
    toPortalPost(post) {
        return {
            id: post.id,
            title: post.title,
            platform: post.platform.toLowerCase(),
            format: post.format.toLowerCase(),
            scheduledDate: post.scheduledDate?.toISOString() ?? null,
            status: post.status.toLowerCase(),
            copy: post.copy,
            attachments: post.attachments?.map((a) => ({
                id: a.id,
                name: a.name,
                url: a.url,
                mimeType: a.mimeType,
            })),
        };
    }
    toPortalPostDetail(post) {
        return {
            ...this.toPortalPost(post),
            copy: post.copy,
            versions: post.versions.map((v) => ({
                id: v.id,
                versionNumber: v.versionNumber,
                title: v.title,
                copyText: v.copyText,
                mediaUrls: v.mediaUrls,
                createdBy: v.createdBy,
                createdAt: v.createdAt.toISOString(),
            })),
        };
    }
};
exports.PortalService = PortalService;
exports.PortalService = PortalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        contracts_service_1.ContractsService,
        assets_service_1.AssetsService,
        notifications_service_1.NotificationsService,
        integrations_service_1.IntegrationsService])
], PortalService);
//# sourceMappingURL=portal.service.js.map