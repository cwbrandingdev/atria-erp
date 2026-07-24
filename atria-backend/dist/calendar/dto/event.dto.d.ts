import { EventCategory } from '@prisma/client';
export declare class CreateEventDto {
    title: string;
    description?: string;
    startAt: string;
    endAt: string;
    category?: EventCategory;
    color?: string;
    isPending?: boolean;
    assigneeId?: string;
    clientId?: string;
    referenceUrl?: string;
}
export declare class UpdateEventDto {
    title?: string;
    description?: string;
    startAt?: string;
    endAt?: string;
    category?: EventCategory;
    color?: string;
    isPending?: boolean;
    assigneeId?: string | null;
    clientId?: string | null;
    referenceUrl?: string | null;
}
export declare class QueryEventsDto {
    from?: string;
    to?: string;
    clientId?: string;
}
