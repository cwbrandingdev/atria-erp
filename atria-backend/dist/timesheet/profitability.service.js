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
exports.ProfitabilityService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const time_logs_service_1 = require("./time-logs.service");
let ProfitabilityService = class ProfitabilityService {
    prisma;
    timeLogsService;
    constructor(prisma, timeLogsService) {
        this.prisma = prisma;
        this.timeLogsService = timeLogsService;
    }
    async getClientProfitability() {
        const avgHourlyRate = await this.timeLogsService.getAverageHourlyRate();
        const clients = await this.prisma.client.findMany({
            select: {
                id: true,
                companyName: true,
                avatarUrl: true,
                contracts: {
                    where: { status: client_1.ContractStatus.SIGNED },
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
                return (sum +
                    (contract.paymentFrequency === 'MONTHLY' ? value : value / 12));
            }, 0);
            const totalSeconds = client.kanbanTasks.reduce((sum, task) => sum +
                task.timeLogs.reduce((taskSum, log) => taskSum + (log.durationInSeconds ?? 0), 0), 0);
            const totalHours = Math.round((totalSeconds / 3600) * 100) / 100;
            const laborCost = Math.round(totalHours * avgHourlyRate * 100) / 100;
            const profit = Math.round((monthlyRevenue - laborCost) * 100) / 100;
            const margin = monthlyRevenue > 0
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
            .filter((c) => c.totalHours > 0 || c.monthlyRevenue > 0 || c.activeContracts > 0)
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
        const totalHours = teamSummary.byMember.reduce((s, m) => s + m.totalSeconds, 0);
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
};
exports.ProfitabilityService = ProfitabilityService;
exports.ProfitabilityService = ProfitabilityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        time_logs_service_1.TimeLogsService])
], ProfitabilityService);
//# sourceMappingURL=profitability.service.js.map