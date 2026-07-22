import { Injectable } from '@nestjs/common';
import { ContentPostStatus } from '@prisma/client';
import { CalendarService } from '../calendar/calendar.service';
import { FinanceService } from '../finance/finance.service';
import { MetaInsightsService } from '../meta-insights/meta-insights.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly financeService: FinanceService,
    private readonly calendarService: CalendarService,
    private readonly metaInsightsService: MetaInsightsService,
  ) {}

  async getOverview(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    const [cashFlow, campaigns, scheduledPosts, todayEvents, myTasks, pendingEvents] =
      await Promise.all([
        this.financeService.getCashFlow(userId),
        Promise.resolve(this.metaInsightsService.getCampaigns()),
        this.prisma.contentPost.findMany({
          where: {
            status: ContentPostStatus.SCHEDULED,
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
    const topCampaign =
      activeCampaigns.length > 0
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
          scheduledDate: p.scheduledDate!.toISOString(),
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

  private async getMyKanbanTasks(userId: string) {
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

  private async getTodayEvents() {
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
}
