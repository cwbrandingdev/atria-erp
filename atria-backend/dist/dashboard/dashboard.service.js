"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const calendar_service_1 = require("../calendar/calendar.service");
const finance_service_1 = require("../finance/finance.service");
const meta_insights_service_1 = require("../meta-insights/meta-insights.service");
const prisma_service_1 = require("../prisma/prisma.service");
let DashboardService = class DashboardService {
    prisma;
    financeService;
    calendarService;
    metaInsightsService;
    constructor(prisma, financeService, calendarService, metaInsightsService) {
        this.prisma = prisma;
        this.financeService = financeService;
        this.calendarService = calendarService;
        this.metaInsightsService = metaInsightsService;
    }
    async getOverview(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { name: true },
        });
        const [cashFlow, campaigns, scheduledPosts, todayEvents, myTasks, pendingEvents] = await Promise.all([
            this.financeService.getCashFlow(userId),
            Promise.resolve(this.metaInsightsService.getCampaigns()),
            this.prisma.contentPost.findMany({
                where: {
                    status: client_1.ContentPostStatus.SCHEDULED,
                    scheduledDate: { gte: new Date() },
                },
                orderBy: { scheduledDate: 'asc' },
                take: 3,
                select: {
                    id: true,
                    title: true,
                    platform: true,
                    scheduledDate: true,
                },
            }),
            this.getTodayEvents(),
            this.getMyKanbanTasks(userId),
            this.prisma.calendarEvent.count({
                where: { isPending: true },
            }),
        ]);
        const activeCampaigns = campaigns.filter((c) => c.status === 'active');
        const topCampaign = activeCampaigns.length > 0
            ? activeCampaigns.reduce((best, c) => (c.roas > best.roas ? c : best))
            : campaigns[0] ?? null;
        const monthlyTrend = cashFlow.monthlyCashFlow.slice(-6);
        return {
            user: {
                name: user?.name ?? 'Usuário',
                notificationCount: pendingEvents,
            },
            finance: {
                revenue: cashFlow.totalRevenue,
                expenses: cashFlow.totalExpenses,
                netProfit: cashFlow.netProfit,
                monthlyTrend: monthlyTrend.map((m) => ({
                    month: m.month,
                    income: m.income,
                    expense: m.expense,
                })),
            },
            contentAndMeta: {
                topCampaign: topCampaign
                    ? {
                        id: topCampaign.id,
                        name: topCampaign.name,
                        roas: topCampaign.roas,
                        spend: topCampaign.spend,
                        ctr: topCampaign.ctr,
                        status: topCampaign.status,
                    }
                    : null,
                scheduledPosts: scheduledPosts.map((p) => ({
                    id: p.id,
                    title: p.title,
                    platform: p.platform.toLowerCase(),
                    scheduledDate: p.scheduledDate.toISOString(),
                })),
            },
            calendar: {
                todayMeetings: todayEvents,
            },
            kanban: {
                myTasks: myTasks.map((t) => ({
                    id: t.id,
                    title: t.title,
                    column: t.column.title,
                    priority: t.priority.toLowerCase(),
                })),
            },
        };
    }
    async getMyKanbanTasks(userId) {
        const lastColumn = await this.prisma.kanbanColumn.findFirst({
            orderBy: { order: 'desc' },
            select: { id: true },
        });
        return this.prisma.kanbanTask.findMany({
            where: {
                assignees: { some: { userId } },
                ...(lastColumn ? { columnId: { not: lastColumn.id } } : {}),
            },
            include: { column: { select: { title: true } } },
            orderBy: [{ columnId: 'asc' }, { order: 'asc' }],
            take: 5,
        });
    }
    async getTodayEvents() {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        const events = await this.calendarService.getEvents({
            from: start.toISOString(),
            to: end.toISOString(),
        });
        return events.map((e) => ({
            id: e.id,
            title: e.title,
            startAt: e.startAt,
            endAt: e.endAt,
            category: e.category,
            color: e.color,
            isPending: e.isPending,
        }));
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        finance_service_1.FinanceService,
        calendar_service_1.CalendarService,
        meta_insights_service_1.MetaInsightsService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map