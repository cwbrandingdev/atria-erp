import { CalendarService } from '../calendar/calendar.service';
import { FinanceService } from '../finance/finance.service';
import { MetaInsightsService } from '../meta-insights/meta-insights.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private readonly prisma;
    private readonly financeService;
    private readonly calendarService;
    private readonly metaInsightsService;
    constructor(prisma: PrismaService, financeService: FinanceService, calendarService: CalendarService, metaInsightsService: MetaInsightsService);
    getOverview(userId: string): Promise<{
        user: {
            name: string;
            notificationCount: number;
        };
        finance: {
            revenue: number;
            expenses: number;
            netProfit: number;
            monthlyTrend: {
                month: string;
                income: number;
                expense: number;
            }[];
        };
        contentAndMeta: {
            topCampaign: {
                id: string;
                name: string;
                roas: number;
                spend: number;
                ctr: number;
                status: import("../meta-insights/meta-insights.service").CampaignStatus;
            } | null;
            scheduledPosts: {
                id: string;
                title: string;
                platform: string;
                scheduledDate: string;
            }[];
        };
        calendar: {
            todayMeetings: {
                id: string;
                title: string;
                startAt: string;
                endAt: string;
                category: string;
                color: string;
                isPending: boolean;
            }[];
        };
        kanban: {
            myTasks: {
                id: string;
                title: string;
                column: string;
                priority: string;
            }[];
        };
    }>;
    private getMyKanbanTasks;
    private getTodayEvents;
}
