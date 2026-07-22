import { type AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import { CreateCommentDto } from './dto/comment.dto';
import { CreateColumnDto, ReorderColumnsDto, UpdateColumnDto } from './dto/column.dto';
import { CreateTaskDto, MoveTaskDto, QueryTasksDto, UpdateTaskDto } from './dto/task.dto';
import { KanbanService } from './kanban.service';
export declare class KanbanController {
    private readonly kanbanService;
    constructor(kanbanService: KanbanService);
    getColumns(): Promise<{
        id: string;
        title: string;
        order: number;
        color: string;
    }[]>;
    createColumn(dto: CreateColumnDto): Promise<{
        id: string;
        title: string;
        order: number;
        color: string;
    }>;
    reorderColumns(dto: ReorderColumnsDto): Promise<{
        id: string;
        title: string;
        order: number;
        color: string;
    }[]>;
    updateColumn(id: string, dto: UpdateColumnDto): Promise<{
        id: string;
        title: string;
        order: number;
        color: string;
    }>;
    deleteColumn(id: string): Promise<void>;
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
    createTask(user: AuthenticatedUser, dto: CreateTaskDto): Promise<{
        id: string;
        title: string;
        description: string | null;
        columnId: string;
        column: {
            id: string;
            title: string;
            order: number;
            color: string;
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
    updateTask(user: AuthenticatedUser, id: string, dto: UpdateTaskDto): Promise<{
        id: string;
        title: string;
        description: string | null;
        columnId: string;
        column: {
            id: string;
            title: string;
            order: number;
            color: string;
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
    moveTask(user: AuthenticatedUser, id: string, dto: MoveTaskDto): Promise<{
        id: string;
        title: string;
        description: string | null;
        columnId: string;
        column: {
            id: string;
            title: string;
            order: number;
            color: string;
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
    getComments(id: string): Promise<{
        id: string;
        content: string;
        createdAt: string;
        user: {
            id: string;
            avatarUrl: string | null;
            name: string;
        };
    }[]>;
    createComment(user: AuthenticatedUser, id: string, dto: CreateCommentDto): Promise<{
        id: string;
        content: string;
        createdAt: string;
        user: {
            id: string;
            avatarUrl: string | null;
            name: string;
        };
    }>;
    getHistory(id: string): Promise<{
        id: string;
        action: string;
        createdAt: string;
        user: {
            id: string;
            avatarUrl: string | null;
            name: string;
        };
    }[]>;
}
