import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTimeLogDto, QueryTimeLogsDto, StartTimerDto, StopTimerDto } from './dto/time-log.dto';
export declare class TimeLogsService {
    private readonly prisma;
    private readonly config;
    constructor(prisma: PrismaService, config: ConfigService);
    getActiveTimer(userId: string): Promise<{
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
    startTimer(userId: string, dto: StartTimerDto): Promise<{
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
    stopTimer(userId: string, dto: StopTimerDto): Promise<{
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
    createManual(userId: string, dto: CreateTimeLogDto): Promise<{
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
    getDefaultHourlyRate(): number;
    getAverageHourlyRate(): Promise<number>;
    private stopLog;
    private ensureTaskExists;
    private formatDuration;
    private toResponse;
}
