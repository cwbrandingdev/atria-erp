import { type AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import { CalendarService } from './calendar.service';
import { CreateEventDto, QueryEventsDto, UpdateEventDto } from './dto/event.dto';
export declare class CalendarController {
    private readonly calendarService;
    constructor(calendarService: CalendarService);
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
        isPending: boolean;
        createdBy: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
        assignee: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
    }[]>;
    createEvent(user: AuthenticatedUser, dto: CreateEventDto): Promise<{
        id: string;
        title: string;
        description: string | null;
        startAt: string;
        endAt: string;
        category: string;
        color: string;
        isPending: boolean;
        createdBy: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
        assignee: {
            id: string;
            name: string;
            avatarUrl: string | null;
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
        isPending: boolean;
        createdBy: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
        assignee: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
    }>;
    deleteEvent(id: string): Promise<void>;
}
