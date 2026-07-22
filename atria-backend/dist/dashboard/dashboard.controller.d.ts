import { type AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getOverview(user: AuthenticatedUser): Promise<{
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
}
