import { type AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import { CreateTimeLogDto, QueryTimeLogsDto, StartTimerDto, StopTimerDto } from './dto/time-log.dto';
import { ProfitabilityService } from './profitability.service';
import { TimeLogsService } from './time-logs.service';
export declare class TimeLogsController {
    private readonly timeLogsService;
    constructor(timeLogsService: TimeLogsService);
    findAll(query: QueryTimeLogsDto): Promise<{
        id: string;
        taskId: string;
        task: {
            client: {
                id: string;
                companyName: string;
            } | null;
            clientId: string | null;
            id: string;
            title: string;
        };
        userId: string;
        user: {
            id: string;
            avatarUrl: string | null;
            name: string;
        };
        startTime: string;
        endTime: string | null;
        durationInSeconds: number | null;
        elapsedSeconds: number;
        isRunning: boolean;
        notes: string | null;
        createdAt: string;
    }[]>;
    getActive(user: AuthenticatedUser): Promise<{
        id: string;
        taskId: string;
        task: {
            client: {
                id: string;
                companyName: string;
            } | null;
            clientId: string | null;
            id: string;
            title: string;
        };
        userId: string;
        user: {
            id: string;
            avatarUrl: string | null;
            name: string;
        };
        startTime: string;
        endTime: string | null;
        durationInSeconds: number | null;
        elapsedSeconds: number;
        isRunning: boolean;
        notes: string | null;
        createdAt: string;
    } | null>;
    getTeamSummary(): Promise<{
        byMember: {
            totalHours: number;
            userId: string;
            name: string;
            avatarUrl: string | null;
            totalSeconds: number;
            logCount: number;
        }[];
        byClient: {
            totalHours: number;
            clientId: string;
            companyName: string;
            totalSeconds: number;
            logCount: number;
        }[];
    }>;
    getTaskSummary(taskId: string): Promise<{
        taskId: string;
        totalLoggedSeconds: number;
        activeLog: {
            id: string;
            taskId: string;
            task: {
                client: {
                    id: string;
                    companyName: string;
                } | null;
                clientId: string | null;
                id: string;
                title: string;
            };
            userId: string;
            user: {
                id: string;
                avatarUrl: string | null;
                name: string;
            };
            startTime: string;
            endTime: string | null;
            durationInSeconds: number | null;
            elapsedSeconds: number;
            isRunning: boolean;
            notes: string | null;
            createdAt: string;
        } | null;
        logs: {
            id: string;
            taskId: string;
            task: {
                client: {
                    id: string;
                    companyName: string;
                } | null;
                clientId: string | null;
                id: string;
                title: string;
            };
            userId: string;
            user: {
                id: string;
                avatarUrl: string | null;
                name: string;
            };
            startTime: string;
            endTime: string | null;
            durationInSeconds: number | null;
            elapsedSeconds: number;
            isRunning: boolean;
            notes: string | null;
            createdAt: string;
        }[];
    }>;
    start(user: AuthenticatedUser, dto: StartTimerDto): Promise<{
        id: string;
        taskId: string;
        task: {
            client: {
                id: string;
                companyName: string;
            } | null;
            clientId: string | null;
            id: string;
            title: string;
        };
        userId: string;
        user: {
            id: string;
            avatarUrl: string | null;
            name: string;
        };
        startTime: string;
        endTime: string | null;
        durationInSeconds: number | null;
        elapsedSeconds: number;
        isRunning: boolean;
        notes: string | null;
        createdAt: string;
    }>;
    stop(user: AuthenticatedUser, dto: StopTimerDto): Promise<{
        id: string;
        taskId: string;
        task: {
            client: {
                id: string;
                companyName: string;
            } | null;
            clientId: string | null;
            id: string;
            title: string;
        };
        userId: string;
        user: {
            id: string;
            avatarUrl: string | null;
            name: string;
        };
        startTime: string;
        endTime: string | null;
        durationInSeconds: number | null;
        elapsedSeconds: number;
        isRunning: boolean;
        notes: string | null;
        createdAt: string;
    }>;
    createManual(user: AuthenticatedUser, dto: CreateTimeLogDto): Promise<{
        id: string;
        taskId: string;
        task: {
            client: {
                id: string;
                companyName: string;
            } | null;
            clientId: string | null;
            id: string;
            title: string;
        };
        userId: string;
        user: {
            id: string;
            avatarUrl: string | null;
            name: string;
        };
        startTime: string;
        endTime: string | null;
        durationInSeconds: number | null;
        elapsedSeconds: number;
        isRunning: boolean;
        notes: string | null;
        createdAt: string;
    }>;
}
export declare class ProfitabilityController {
    private readonly profitabilityService;
    constructor(profitabilityService: ProfitabilityService);
    getOverview(): Promise<{
        avgHourlyRate: number;
        totalRevenue: number;
        totalLaborCost: number;
        totalProfit: number;
        totalHours: number;
        clients: {
            clientId: string;
            companyName: string;
            avatarUrl: string | null;
            monthlyRevenue: number;
            totalHours: number;
            laborCost: number;
            profit: number;
            margin: number;
            activeContracts: number;
        }[];
        teamSummary: {
            byMember: {
                totalHours: number;
                userId: string;
                name: string;
                avatarUrl: string | null;
                totalSeconds: number;
                logCount: number;
            }[];
            byClient: {
                totalHours: number;
                clientId: string;
                companyName: string;
                totalSeconds: number;
                logCount: number;
            }[];
        };
    }>;
    getClients(): Promise<{
        clientId: string;
        companyName: string;
        avatarUrl: string | null;
        monthlyRevenue: number;
        totalHours: number;
        laborCost: number;
        profit: number;
        margin: number;
        activeContracts: number;
    }[]>;
}
