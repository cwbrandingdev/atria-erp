import { Injectable } from '@nestjs/common';
import { ContractStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { TimeLogsService } from './time-logs.service';

@Injectable()
export class ProfitabilityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly timeLogsService: TimeLogsService,
  ) {}

  async getClientProfitability() {
    const avgHourlyRate = await this.timeLogsService.getAverageHourlyRate();

    const clients = await this.prisma.client.findMany({
      select: {
        id: true,
        companyName: true,
        avatarUrl: true,
        contracts: {
          where: { status: ContractStatus.SIGNED },
          select: {
            recurringValue: true,
            paymentFrequency: true,
          },
        },
        kanbanTasks: {
          select: {
            timeLogs: {
              where: { durationInSeconds: { not: null } },
              select: { durationInSeconds: true },
            },
          },
        },
      },
      orderBy: { companyName: 'asc' },
    });

    return clients
      .map((client) => {
        const monthlyRevenue = client.contracts.reduce((sum, contract) => {
          const value = Number(contract.recurringValue);
          return (
            sum +
            (contract.paymentFrequency === 'MONTHLY' ? value : value / 12)
          );
        }, 0);

        const totalSeconds = client.kanbanTasks.reduce(
          (sum, task) =>
            sum +
            task.timeLogs.reduce(
              (taskSum, log) => taskSum + (log.durationInSeconds ?? 0),
              0,
            ),
          0,
        );

        const totalHours = Math.round((totalSeconds / 3600) * 100) / 100;
        const laborCost = Math.round(totalHours * avgHourlyRate * 100) / 100;
        const profit = Math.round((monthlyRevenue - laborCost) * 100) / 100;
        const margin =
          monthlyRevenue > 0
            ? Math.round((profit / monthlyRevenue) * 10000) / 100
            : 0;

        return {
          clientId: client.id,
          companyName: client.companyName,
          avatarUrl: client.avatarUrl,
          monthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
          totalHours,
          laborCost,
          profit,
          margin,
          activeContracts: client.contracts.length,
        };
      })
      .filter(
        (c) => c.totalHours > 0 || c.monthlyRevenue > 0 || c.activeContracts > 0,
      )
      .sort((a, b) => b.profit - a.profit);
  }

  async getOverview() {
    const [clients, avgHourlyRate, teamSummary] = await Promise.all([
      this.getClientProfitability(),
      this.timeLogsService.getAverageHourlyRate(),
      this.timeLogsService.getTeamSummary(),
    ]);

    const totalRevenue = clients.reduce((s, c) => s + c.monthlyRevenue, 0);
    const totalLaborCost = clients.reduce((s, c) => s + c.laborCost, 0);
    const totalProfit = clients.reduce((s, c) => s + c.profit, 0);
    const totalHours = teamSummary.byMember.reduce(
      (s, m) => s + m.totalSeconds,
      0,
    );

    return {
      avgHourlyRate,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalLaborCost: Math.round(totalLaborCost * 100) / 100,
      totalProfit: Math.round(totalProfit * 100) / 100,
      totalHours: Math.round((totalHours / 3600) * 100) / 100,
      clients,
      teamSummary,
    };
  }
}
