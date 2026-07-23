import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateCommentDto } from './dto/comment.dto';
import { CreateColumnDto, ReorderColumnsDto, UpdateColumnDto } from './dto/column.dto';
import { CreateTaskDto, MoveTaskDto, QueryTasksDto, UpdateTaskDto } from './dto/task.dto';
export declare class KanbanService {
    private readonly prisma;
    private readonly notifications;
    constructor(prisma: PrismaService, notifications: NotificationsService);
    getColumns(): Promise<{
        id: string;
        title: string;
        order: number;
        color: string;
        type: "to_do" | "in_progress" | "done" | "custom" | null;
    }[]>;
    createColumn(dto: CreateColumnDto): Promise<{
        id: string;
        title: string;
        order: number;
        color: string;
        type: "to_do" | "in_progress" | "done" | "custom" | null;
    }>;
    updateColumn(id: string, dto: UpdateColumnDto): Promise<{
        id: string;
        title: string;
        order: number;
        color: string;
        type: "to_do" | "in_progress" | "done" | "custom" | null;
    }>;
    deleteColumn(id: string): Promise<void>;
    reorderColumns(dto: ReorderColumnsDto): Promise<{
        id: string;
        title: string;
        order: number;
        color: string;
        type: "to_do" | "in_progress" | "done" | "custom" | null;
    }[]>;
    getTasks(query: QueryTasksDto): Promise<{
        id: string;
        title: string;
        description: string | null;
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
    }[]>;
    getTask(id: string): Promise<{
        id: string;
        title: string;
        description: string | null;
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
    }>;
    createTask(userId: string, dto: CreateTaskDto): Promise<{
        id: string;
        title: string;
        description: string | null;
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
    }>;
    updateTask(userId: string, id: string, dto: UpdateTaskDto): Promise<{
        id: string;
        title: string;
        description: string | null;
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
    }>;
    moveTask(userId: string, id: string, dto: MoveTaskDto): Promise<{
        id: string;
        title: string;
        description: string | null;
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
    }>;
    deleteTask(id: string): Promise<void>;
    getComments(taskId: string): Promise<{
        id: string;
        content: string;
        createdAt: string;
        user: {
            id: string;
            avatarUrl: string | null;
            name: string;
        };
    }[]>;
    createComment(userId: string, taskId: string, dto: CreateCommentDto): Promise<{
        id: string;
        content: string;
        createdAt: string;
        user: {
            id: string;
            avatarUrl: string | null;
            name: string;
        };
    }>;
    getHistory(taskId: string): Promise<{
        id: string;
        action: string;
        createdAt: string;
        user: {
            id: string;
            avatarUrl: string | null;
            name: string;
        };
    }[]>;
    private ensureDefaultColumns;
    private taskInclude;
    private ensureColumnExists;
    private ensureTaskExists;
    private validateAssignees;
    private ensureClientExists;
    private getTaskLoggedSeconds;
    private logHistory;
    private logTaskChanges;
    private toColumnResponse;
    private toTaskResponse;
}
