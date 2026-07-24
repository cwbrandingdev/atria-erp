import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto, QueryEventsDto, UpdateEventDto } from './dto/event.dto';
export declare class CalendarService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getTeamMembers(): Promise<{
        color: string;
        id: string;
        email: string;
        avatarUrl: string | null;
        name: string;
    }[]>;
    getEvents(query: QueryEventsDto): Promise<{
        id: string;
        title: string;
        description: string | null;
        startAt: string;
        endAt: string;
        category: string;
        color: string;
        referenceUrl: string | null;
        isPending: boolean;
        clientId: string | null;
        client: {
            id: string;
            companyName: string;
            avatarUrl: string | null;
            color: string;
        } | null;
        createdBy: {
            id: string;
            avatarUrl: string | null;
            name: string;
        };
        assignee: {
            id: string;
            avatarUrl: string | null;
            name: string;
        } | null;
    }[]>;
    createEvent(userId: string, dto: CreateEventDto): Promise<{
        id: string;
        title: string;
        description: string | null;
        startAt: string;
        endAt: string;
        category: string;
        color: string;
        referenceUrl: string | null;
        isPending: boolean;
        clientId: string | null;
        client: {
            id: string;
            companyName: string;
            avatarUrl: string | null;
            color: string;
        } | null;
        createdBy: {
            id: string;
            avatarUrl: string | null;
            name: string;
        };
        assignee: {
            id: string;
            avatarUrl: string | null;
            name: string;
        } | null;
    }>;
    updateEvent(id: string, dto: UpdateEventDto): Promise<{
        id: string;
        title: string;
        description: string | null;
        startAt: string;
        endAt: string;
        category: string;
        color: string;
        referenceUrl: string | null;
        isPending: boolean;
        clientId: string | null;
        client: {
            id: string;
            companyName: string;
            avatarUrl: string | null;
            color: string;
        } | null;
        createdBy: {
            id: string;
            avatarUrl: string | null;
            name: string;
        };
        assignee: {
            id: string;
            avatarUrl: string | null;
            name: string;
        } | null;
    }>;
    deleteEvent(id: string): Promise<void>;
    private ensureEventExists;
    private ensureClientExists;
    private getClientColor;
    private toEventResponse;
}
