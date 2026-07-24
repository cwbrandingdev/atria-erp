import { type AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import { CreationService } from './creation.service';
import { CreateBriefPlanDto, GenerateBriefPlanDto } from './dto/brief-to-content.dto';
export declare class CreationController {
    private readonly creationService;
    constructor(creationService: CreationService);
    getCommandCenter(): Promise<{
        weekRange: {
            start: string;
            end: string;
        };
        deliverables: {
            groups: {
                clientId: string;
                clientName: string;
                avatarUrl: string | null;
                items: ReturnType<any>[];
            }[];
            summary: {
                total: number;
                byFormat: Record<string, number>;
                byStatus: Record<string, number>;
            };
        };
        approvalsQueue: {
            id: string;
            title: string;
            clientId: string;
            clientName: string;
            clientAvatarUrl: string | null;
            platform: "instagram" | "tiktok" | "youtube" | "linkedin";
            format: "carousel" | "reels" | "static" | "story";
            status: "draft" | "pending_approval" | "approved" | "rejected" | "scheduled" | "published";
            assignee: {
                id: string;
                avatarUrl: string | null;
                name: string;
            } | null;
            updatedAt: string;
            scheduledDate: string | null;
        }[];
        publishingSchedule: ({
            id: string;
            type: "post";
            title: string;
            clientId: string;
            clientName: string;
            platform: "instagram" | "tiktok" | "youtube" | "linkedin";
            format: "carousel" | "reels" | "static" | "story";
            status: "draft" | "pending_approval" | "approved" | "rejected" | "scheduled" | "published";
            scheduledAt: string;
            color: string;
        } | {
            id: string;
            type: "event";
            title: string;
            clientId: string | null;
            clientName: string;
            platform: null;
            format: null;
            status: string;
            scheduledAt: string;
            color: string;
            referenceUrl: string | null;
        })[];
        blockers: ({
            id: string;
            severity: "red";
            type: "overdue_task";
            title: string;
            description: string;
            clientId: string | null;
            clientName: string;
            dueDate: string | null;
            href: string;
        } | {
            id: string;
            severity: "amber";
            type: "missing_assets";
            title: string;
            description: string;
            clientId: string;
            clientName: string;
            dueDate: string | null;
            href: string;
        } | {
            id: string;
            severity: "red";
            type: "unsigned_contract";
            title: string;
            description: string;
            clientId: string;
            clientName: string;
            dueDate: string;
            href: string;
        })[];
        stats: {
            deliverablesThisWeek: number;
            pendingApprovals: number;
            scheduledReleases: number;
            activeBlockers: number;
        };
    }>;
    generateFromBrief(dto: GenerateBriefPlanDto): Promise<{
        clientId: string;
        clientName: string;
        summary: string;
        platform: "instagram" | "tiktok" | "youtube" | "linkedin";
        ideas: {
            title: string;
            copy: string;
            format: "carousel" | "reels" | "static" | "story";
            mediaConcept: string;
            suggestedDate: string;
        }[];
        provider: "openai" | "gemini" | "fallback";
    }>;
    createFromBriefPlan(user: AuthenticatedUser, dto: CreateBriefPlanDto): Promise<{
        created: {
            posts: number;
            tasks: number;
        };
        posts: {
            id: string;
            title: string;
            clientId: string;
            client: {
                id: string;
                companyName: string;
                instagram: string | null;
                avatarUrl: string | null;
            };
            platform: "instagram" | "tiktok" | "youtube" | "linkedin";
            format: "carousel" | "reels" | "static" | "story";
            scheduledDate: string | null;
            status: "draft" | "pending_approval" | "approved" | "rejected" | "scheduled" | "published";
            copy: string;
            referenceUrl: string | null;
            attachments: {
                id: string;
                createdAt: Date;
                name: string;
                postId: string;
                url: string;
                mimeType: string | null;
            }[];
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
            platformColor: string;
            createdAt: string;
            updatedAt: string;
        }[];
        tasks: {
            id: string;
            title: string;
            description: string | null;
            referenceUrl: string | null;
            columnId: string;
            column: {
                id: string;
                title: string;
                order: number;
                color: string;
                type: "to_do" | "in_progress" | "done" | "custom" | null;
            };
            clientId: string | null;
            client: {
                id: string;
                companyName: string;
                avatarUrl: string | null;
            } | null;
            priority: "critical" | "high" | "medium" | "low" | "planned";
            order: number;
            dueDate: string | null;
            assignees: {
                id: string;
                avatarUrl: string | null;
                name: string;
            }[];
            createdBy: {
                id: string;
                avatarUrl: string | null;
                name: string;
            };
            totalLoggedSeconds: number;
            createdAt: string;
            updatedAt: string;
        }[];
    }>;
}
