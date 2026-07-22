import { KanbanTaskPriority } from '@prisma/client';
export declare class CreateTaskDto {
    title: string;
    description?: string;
    columnId: string;
    priority?: KanbanTaskPriority;
    dueDate?: string;
    assigneeIds?: string[];
    clientId?: string;
}
export declare class UpdateTaskDto {
    title?: string;
    description?: string;
    columnId?: string;
    priority?: KanbanTaskPriority;
    dueDate?: string;
    assigneeIds?: string[];
    order?: number;
    clientId?: string | null;
}
export declare class MoveTaskDto {
    columnId: string;
    order: number;
}
export declare class QueryTasksDto {
    columnId?: string;
}
