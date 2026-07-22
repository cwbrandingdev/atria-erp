import { ReportsService } from './reports.service';
export declare class PortalController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getPortalData(token: string): Promise<{
        client: {
            id: string;
            companyName: string;
            contactName: string | null;
            email: string | null;
            instagram: string | null;
            avatarUrl: string | null;
        } | null;
        accountStatus: {
            activeContracts: number;
            pendingApprovals: number;
            scheduledPosts: number;
            publishedPosts: number;
            status: string;
        };
        pendingApprovalPosts: {
            id: string;
            title: string;
            platform: string;
            format: string;
            scheduledDate: string | null;
            status: string;
            copy: string | undefined;
        }[];
        scheduledPosts: {
            id: string;
            title: string;
            platform: string;
            format: string;
            scheduledDate: string | null;
            status: string;
            copy: string | undefined;
        }[];
        recentReports: {
            id: string;
            title: string;
            month: number;
            year: number;
            periodLabel: string;
            createdAt: string;
        }[];
        contracts: {
            id: string;
            title: string;
            status: string;
            recurringValue: number;
            paymentFrequency: string;
            startDate: string;
            endDate: string | null;
        }[];
    }>;
    getPortalReport(token: string, reportId: string): Promise<{
        id: string;
        clientId: string;
        client: {
            id: string;
            companyName: string;
            contactName: string | null;
            email: string | null;
            instagram: string | null;
            avatarUrl: string | null;
        };
        month: number;
        year: number;
        title: string;
        data: import("@prisma/client/runtime/library").JsonValue;
        generatedBy: {
            id: string;
            avatarUrl: string | null;
            name: string;
        };
        createdAt: string;
    }>;
}
