import { Client360Service } from './client-360.service';
import { ClientsService } from './clients.service';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';
import { QueryClient360Dto } from './dto/client-360.dto';
export declare class ClientsController {
    private readonly clientsService;
    private readonly client360Service;
    constructor(clientsService: ClientsService, client360Service: Client360Service);
    findAll(clientGroupId?: string): Promise<{
        id: string;
        companyName: string;
        contactName: string | null;
        email: string | null;
        phone: string | null;
        instagram: string | null;
        website: string | null;
        street: string | null;
        number: string | null;
        city: string | null;
        state: string | null;
        zipCode: string | null;
        address: string | null;
        notes: string | null;
        avatarUrl: string | null;
        clientGroup: {
            id: string;
            name: string;
            description: string | null;
            color: string;
        } | null;
        postCount: number;
        createdAt: string;
        updatedAt: string;
    }[]>;
    getClient360(id: string, query: QueryClient360Dto): Promise<{
        section: string;
        overview: {
            drafts: number;
            pendingApproval: number;
            approved: number;
            scheduled: number;
            published: number;
            rejected: number;
            total: number;
        };
        posts: {
            id: string;
            title: string;
            platform: "instagram" | "tiktok" | "youtube" | "linkedin";
            format: "carousel" | "reels" | "static" | "story";
            status: "draft" | "pending_approval" | "approved" | "rejected" | "scheduled" | "published";
            scheduledDate: string | null;
            copy: string;
            referenceUrl: string | null;
            attachmentCount: number;
            previewUrl: string;
            previewMimeType: string | null;
            author: {
                id: string;
                avatarUrl: string | null;
                name: string;
            };
            assignee: {
                id: string;
                avatarUrl: string | null;
                name: string;
            } | null;
            updatedAt: string;
            platformColor: string;
        }[];
        versionHistory: {
            id: string;
            postId: string;
            postTitle: string;
            versionNumber: number;
            title: string;
            copyPreview: string;
            mediaUrls: string[];
            createdBy: {
                id: string;
                avatarUrl: string | null;
                name: string;
            };
            createdAt: string;
        }[];
    } | {
        section: string;
        mrr: number;
        contracts: {
            id: string;
            title: string;
            status: "draft" | "sent" | "signed" | "expired" | "cancelled";
            recurringValue: number;
            paymentFrequency: "monthly" | "one_time";
            startDate: string;
            endDate: string | null;
            pdfUrl: string | null;
            receivablesCount: number;
            updatedAt: string;
        }[];
        monthlyInvoicing: {
            month: number;
            year: number;
            total: number;
            paid: number;
            pending: number;
            items: {
                id: string;
                description: string;
                amount: number;
                status: "paid" | "pending" | "overdue";
                date: string;
                dueDate: string | null;
                contractId: string | null;
            }[];
        };
    } | {
        section: string;
        items: ({
            id: string;
            type: "event";
            title: string;
            category: "meeting" | "deadline" | "publish" | "other";
            startAt: string;
            endAt: string;
            referenceUrl: string | null;
            isPending: boolean;
            color: string;
            assignee: {
                id: string;
                avatarUrl: string | null;
                name: string;
            } | null;
        } | {
            id: string;
            type: "post";
            title: string;
            category: "publish";
            startAt: string;
            endAt: string;
            referenceUrl: string;
            isPending: boolean;
            color: string;
            platform: "instagram" | "tiktok" | "youtube" | "linkedin";
            format: "carousel" | "reels" | "static" | "story";
            status: "draft" | "pending_approval" | "approved" | "rejected" | "scheduled" | "published";
            assignee: null;
        })[];
        meetings: ({
            id: string;
            type: "event";
            title: string;
            category: "meeting" | "deadline" | "publish" | "other";
            startAt: string;
            endAt: string;
            referenceUrl: string | null;
            isPending: boolean;
            color: string;
            assignee: {
                id: string;
                avatarUrl: string | null;
                name: string;
            } | null;
        } | {
            id: string;
            type: "post";
            title: string;
            category: "publish";
            startAt: string;
            endAt: string;
            referenceUrl: string;
            isPending: boolean;
            color: string;
            platform: "instagram" | "tiktok" | "youtube" | "linkedin";
            format: "carousel" | "reels" | "static" | "story";
            status: "draft" | "pending_approval" | "approved" | "rejected" | "scheduled" | "published";
            assignee: null;
        })[];
        releases: ({
            id: string;
            type: "event";
            title: string;
            category: "meeting" | "deadline" | "publish" | "other";
            startAt: string;
            endAt: string;
            referenceUrl: string | null;
            isPending: boolean;
            color: string;
            assignee: {
                id: string;
                avatarUrl: string | null;
                name: string;
            } | null;
        } | {
            id: string;
            type: "post";
            title: string;
            category: "publish";
            startAt: string;
            endAt: string;
            referenceUrl: string;
            isPending: boolean;
            color: string;
            platform: "instagram" | "tiktok" | "youtube" | "linkedin";
            format: "carousel" | "reels" | "static" | "story";
            status: "draft" | "pending_approval" | "approved" | "rejected" | "scheduled" | "published";
            assignee: null;
        })[];
    } | {
        section: string;
        referenceLinks: {
            label: string;
            url: string;
            type: string;
        }[];
        assets: {
            id: string;
            fileName: string;
            fileType: "image";
            fileUrl: string;
            fileSize: number;
            uploadedAt: string;
            uploadedBy: {
                id: string;
                name: string;
                avatarUrl: string | null;
            } | null;
        }[];
        grouped: {
            logo: {
                id: string;
                fileName: string;
                fileType: "image";
                fileUrl: string;
                fileSize: number;
                uploadedAt: string;
                uploadedBy: {
                    id: string;
                    name: string;
                    avatarUrl: string | null;
                } | null;
            }[];
            brand_guide: {
                id: string;
                fileName: string;
                fileType: "image";
                fileUrl: string;
                fileSize: number;
                uploadedAt: string;
                uploadedBy: {
                    id: string;
                    name: string;
                    avatarUrl: string | null;
                } | null;
            }[];
            image: {
                id: string;
                fileName: string;
                fileType: "image";
                fileUrl: string;
                fileSize: number;
                uploadedAt: string;
                uploadedBy: {
                    id: string;
                    name: string;
                    avatarUrl: string | null;
                } | null;
            }[];
            document: {
                id: string;
                fileName: string;
                fileType: "image";
                fileUrl: string;
                fileSize: number;
                uploadedAt: string;
                uploadedBy: {
                    id: string;
                    name: string;
                    avatarUrl: string | null;
                } | null;
            }[];
        };
        totals: {
            all: number;
            logos: number;
            brandGuides: number;
            images: number;
            documents: number;
        };
    } | {
        section: string;
        tasks: {
            id: string;
            title: string;
            description: string | null;
            referenceUrl: string | null;
            priority: "critical" | "high" | "medium" | "low" | "planned";
            dueDate: string | null;
            column: {
                id: string;
                title: string;
                type: "to_do" | "in_progress" | "done" | "custom";
                color: string;
            };
            assignees: {
                id: string;
                avatarUrl: string | null;
                name: string;
            }[];
            isOverdue: boolean;
            updatedAt: string;
        }[];
    } | {
        section: string;
        client: {
            id: string;
            companyName: string;
            contactName: string | null;
            email: string | null;
            phone: string | null;
            instagram: string | null;
            website: string | null;
            notes: string | null;
            avatarUrl: string | null;
            clientGroup: {
                id: string;
                name: string;
                color: string;
            } | null;
            postCount: number;
            assetCount: number;
            contractCount: number;
        };
        metrics: {
            mrr: number;
            activeContractsCount: number;
            signedContractsCount: number;
            openTasks: number;
            pendingApprovals: number;
            scheduledPosts: number;
            overdueTasks: number;
        };
        health: "at_risk" | "attention" | "healthy";
        activeContracts: {
            id: string;
            title: string;
            status: "draft" | "sent" | "signed" | "expired" | "cancelled";
            recurringValue: number;
            paymentFrequency: "monthly" | "one_time";
            startDate: string;
            endDate: string | null;
        }[];
        insights: {
            reach: number;
            impressions: number;
            spend: number;
            engagement: number;
            engagementRate: number;
            conversions: number;
            roas: number;
            activeCampaigns: number;
            performanceChart: {
                date: string;
                spend: number;
                reach: number;
                engagement: number;
            }[];
        };
    }>;
    findOne(id: string): Promise<{
        id: string;
        companyName: string;
        contactName: string | null;
        email: string | null;
        phone: string | null;
        instagram: string | null;
        website: string | null;
        street: string | null;
        number: string | null;
        city: string | null;
        state: string | null;
        zipCode: string | null;
        address: string | null;
        notes: string | null;
        avatarUrl: string | null;
        clientGroup: {
            id: string;
            name: string;
            description: string | null;
            color: string;
        } | null;
        postCount: number;
        createdAt: string;
        updatedAt: string;
    }>;
    create(dto: CreateClientDto): Promise<{
        id: string;
        companyName: string;
        contactName: string | null;
        email: string | null;
        phone: string | null;
        instagram: string | null;
        website: string | null;
        street: string | null;
        number: string | null;
        city: string | null;
        state: string | null;
        zipCode: string | null;
        address: string | null;
        notes: string | null;
        avatarUrl: string | null;
        clientGroup: {
            id: string;
            name: string;
            description: string | null;
            color: string;
        } | null;
        postCount: number;
        createdAt: string;
        updatedAt: string;
    }>;
    update(id: string, dto: UpdateClientDto): Promise<{
        id: string;
        companyName: string;
        contactName: string | null;
        email: string | null;
        phone: string | null;
        instagram: string | null;
        website: string | null;
        street: string | null;
        number: string | null;
        city: string | null;
        state: string | null;
        zipCode: string | null;
        address: string | null;
        notes: string | null;
        avatarUrl: string | null;
        clientGroup: {
            id: string;
            name: string;
            description: string | null;
            color: string;
        } | null;
        postCount: number;
        createdAt: string;
        updatedAt: string;
    }>;
    remove(id: string): Promise<void>;
}
