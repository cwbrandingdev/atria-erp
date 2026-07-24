import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(userId: string, unreadOnly?: boolean): Promise<{
        id: string;
        userId: string;
        title: string;
        message: string;
        type: "task_assigned" | "contract_signed" | "post_pending" | "post_rejected";
        isRead: boolean;
        createdAt: string;
    }[]>;
    getUnreadCount(userId: string): Promise<number>;
    markAsRead(userId: string, id: string): Promise<{
        id: string;
        userId: string;
        title: string;
        message: string;
        type: "task_assigned" | "contract_signed" | "post_pending" | "post_rejected";
        isRead: boolean;
        createdAt: string;
    } | null>;
    markAllAsRead(userId: string): Promise<{
        success: boolean;
    }>;
    notifyTaskAssigned(assigneeIds: string[], taskTitle: string, actorId: string): Promise<void>;
    notifyContractSigned(userIds: string[], contractTitle: string, clientName: string): Promise<void>;
    notifyPostPending(userIds: string[], postTitle: string, clientName: string): Promise<void>;
    notifyPostRejected(userIds: string[], postTitle: string, clientName: string, reason: string): Promise<void>;
    private createMany;
    private toResponse;
}
