import { PrismaService } from '../prisma/prisma.service';
import { TimeLogsService } from './time-logs.service';
export declare class ProfitabilityService {
    private readonly prisma;
    private readonly timeLogsService;
    constructor(prisma: PrismaService, timeLogsService: TimeLogsService);
    getClientProfitability(): Promise<{
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
}
