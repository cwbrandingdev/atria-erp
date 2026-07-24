import { Prisma } from '@prisma/client';
import { AssetsService } from '../assets/assets.service';
import { ContractsService } from '../contracts/contracts.service';
import { IntegrationsService } from '../integrations/integrations.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { PortalBriefingDto, PortalRejectPostDto } from './dto/portal.dto';
export declare class PortalService {
    private readonly prisma;
    private readonly contractsService;
    private readonly assetsService;
    private readonly notifications;
    private readonly integrations;
    constructor(prisma: PrismaService, contractsService: ContractsService, assetsService: AssetsService, notifications: NotificationsService, integrations: IntegrationsService);
    generatePortalToken(clientId: string): Promise<{
        clientId: string;
        companyName: string;
        token: string;
        portalUrl: string;
    }>;
    getPortalData(rawToken: string): Promise<{
        client: {
            id: string;
            companyName: string;
            contactName: string | null;
            email: string | null;
            instagram: string | null;
            avatarUrl: string | null;
        } | null;
        accountStatus: {
            activeContracts: number;
            pendingApprovals: number;
            scheduledPosts: number;
            publishedPosts: number;
            status: "active" | "onboarding";
        };
        pendingApprovalPosts: {
            id: string;
            title: string;
            platform: string;
            format: string;
            scheduledDate: string | null;
            status: string;
            copy: string | undefined;
            attachments: {
                id: string;
                name: string;
                url: string;
                mimeType: string | null;
            }[] | undefined;
        }[];
        scheduledPosts: {
            id: string;
            title: string;
            platform: string;
            format: string;
            scheduledDate: string | null;
            status: string;
            copy: string | undefined;
            attachments: {
                id: string;
                name: string;
                url: string;
                mimeType: string | null;
            }[] | undefined;
        }[];
        recentReports: {
            id: string;
            title: string;
            month: number;
            year: number;
            periodLabel: string;
            createdAt: string;
        }[];
        contracts: {
            id: string;
            title: string;
            status: string;
            recurringValue: number;
            paymentFrequency: string;
            startDate: string;
            endDate: string | null;
            pdfUrl: string | null;
            hasTerms: boolean;
        }[];
        recentBriefs: {
            id: string;
            title: string;
            content: string;
            createdAt: string;
        }[];
    }>;
    getPortalReport(rawToken: string, reportId: string): Promise<{
        id: string;
        clientId: string;
        client: {
            id: string;
            companyName: string;
            contactName: string | null;
            email: string | null;
            instagram: string | null;
            avatarUrl: string | null;
        };
        month: number;
        year: number;
        title: string;
        data: Prisma.JsonValue;
        generatedBy: {
            id: string;
            avatarUrl: string | null;
            name: string;
        };
        createdAt: string;
    }>;
    getPortalPost(rawToken: string, postId: string): Promise<{
        copy: string;
        versions: {
            id: string;
            versionNumber: number;
            title: string;
            copyText: string;
            mediaUrls: string[];
            createdBy: {
                id: string;
                avatarUrl: string | null;
                name: string;
            };
            createdAt: string;
        }[];
        id: string;
        title: string;
        platform: string;
        format: string;
        scheduledDate: string | null;
        status: string;
        attachments: {
            id: string;
            name: string;
            url: string;
            mimeType: string | null;
        }[] | undefined;
    }>;
    approvePortalPost(rawToken: string, postId: string): Promise<{
        id: string;
        title: string;
        platform: string;
        format: string;
        scheduledDate: string | null;
        status: string;
        copy: string | undefined;
        attachments: {
            id: string;
            name: string;
            url: string;
            mimeType: string | null;
        }[] | undefined;
    }>;
    rejectPortalPost(rawToken: string, postId: string, dto: PortalRejectPostDto): Promise<{
        id: string;
        title: string;
        platform: string;
        format: string;
        scheduledDate: string | null;
        status: string;
        copy: string | undefined;
        attachments: {
            id: string;
            name: string;
            url: string;
            mimeType: string | null;
        }[] | undefined;
    }>;
    getPortalContract(rawToken: string, contractId: string): Promise<{
        id: string;
        clientId: string;
        client: {
            number: string | null;
            id: string;
            companyName: string;
            contactName: string | null;
            email: string | null;
            phone: string | null;
            street: string | null;
            city: string | null;
            state: string | null;
            zipCode: string | null;
            avatarUrl: string | null;
        };
        title: string;
        status: string;
        recurringValue: number;
        paymentFrequency: string;
        startDate: string;
        endDate: string | null;
        termsContent: string;
        pdfUrl: string | null;
        createdBy: {
            id: string;
            email: string;
            avatarUrl: string | null;
            name: string;
        };
        createdAt: string;
        updatedAt: string;
    }>;
    signPortalContract(rawToken: string, contractId: string): Promise<{
        contract: {
            id: string;
            clientId: string;
            client: {
                number: string | null;
                id: string;
                companyName: string;
                contactName: string | null;
                email: string | null;
                phone: string | null;
                street: string | null;
                city: string | null;
                state: string | null;
                zipCode: string | null;
                avatarUrl: string | null;
            };
            title: string;
            status: "draft" | "sent" | "signed" | "expired" | "cancelled";
            recurringValue: number;
            paymentFrequency: "monthly" | "one_time";
            startDate: string;
            endDate: string | null;
            termsContent: string;
            pdfUrl: string | null;
            createdBy: {
                id: string;
                email: string;
                avatarUrl: string | null;
                name: string;
            };
            receivablesCount: number;
            createdAt: string;
            updatedAt: string;
        };
        receivablesGenerated: number;
        receivables: {
            id: string;
            description: string;
            amount: number;
            type: "income" | "expense";
            status: "paid" | "pending" | "overdue";
            date: string;
            dueDate: string | null;
            categoryId: string;
            category: string;
            categoryColor: string;
            createdAt: string;
        }[];
    }>;
    uploadPortalAsset(rawToken: string, file: Express.Multer.File, fileType?: string): Promise<{
        id: string;
        clientId: string;
        client: {
            id: string;
            companyName: string;
            avatarUrl: string | null;
        };
        fileName: string;
        fileType: "image" | "logo" | "brand_guide" | "document";
        fileUrl: string;
        fileSize: number;
        uploadedBy: {
            id: string;
            avatarUrl: string | null;
            name: string;
        } | null;
        uploadedAt: string;
    }>;
    createBriefing(rawToken: string, dto: PortalBriefingDto): Promise<{
        id: string;
        title: string;
        content: string;
        createdAt: string;
    }>;
    private resolvePortalToken;
    private hashToken;
    private getContentOverview;
    private toPortalPost;
    private toPortalPostDetail;
}
