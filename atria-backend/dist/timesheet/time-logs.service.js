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
exports.TimeLogsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const userSelect = { id: true, name: true, avatarUrl: true };
const logInclude = {
    task: {
        select: {
            id: true,
            title: true,
            clientId: true,
            client: { select: { id: true, companyName: true } },
        },
    },
    user: { select: userSelect },
};
let TimeLogsService = class TimeLogsService {
    prisma;
    config;
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
    }
    async getActiveTimer(userId) {
        const active = await this.prisma.timeLog.findFirst({
            where: { userId, endTime: null },
            include: logInclude,
            orderBy: { startTime: 'desc' },
        });
        return active ? this.toResponse(active) : null;
    }
    async startTimer(userId, dto) {
        await this.ensureTaskExists(dto.taskId);
        const existing = await this.prisma.timeLog.findFirst({
            where: { userId, endTime: null },
        });
        if (existing) {
            if (existing.taskId === dto.taskId) {
                throw new common_1.BadRequestException('Timer already running for this task');
            }
            await this.stopLog(existing.id, new Date());
        }
        const log = await this.prisma.timeLog.create({
            data: {
                taskId: dto.taskId,
                userId,
                startTime: new Date(),
                notes: dto.notes,
            },
            include: logInclude,
        });
        await this.prisma.taskHistory.create({
            data: {
                taskId: dto.taskId,
                userId,
                action: 'Timer iniciado',
            },
        });
        return this.toResponse(log);
    }
    async stopTimer(userId, dto) {
        const active = await this.prisma.timeLog.findFirst({
            where: { userId, taskId: dto.taskId, endTime: null },
            include: logInclude,
        });
        if (!active) {
            throw new common_1.NotFoundException('No active timer found for this task');
        }
        const updated = await this.stopLog(active.id, new Date());
        await this.prisma.taskHistory.create({
            data: {
                taskId: dto.taskId,
                userId,
                action: `Timer pausado (${this.formatDuration(updated.durationInSeconds ?? 0)})`,
            },
        });
        return this.toResponse(updated);
    }
    async findAll(query) {
        const where = {
            taskId: query.taskId,
            userId: query.userId,
            ...(query.clientId ? { task: { clientId: query.clientId } } : {}),
        };
        const logs = await this.prisma.timeLog.findMany({
            where,
            include: logInclude,
            orderBy: { startTime: 'desc' },
        });
        return logs.map((log) => this.toResponse(log));
    }
    async getTaskSummary(taskId) {
        await this.ensureTaskExists(taskId);
        const [logs, aggregate] = await Promise.all([
            this.prisma.timeLog.findMany({
                where: { taskId },
                include: logInclude,
                orderBy: { startTime: 'desc' },
            }),
            this.prisma.timeLog.aggregate({
                where: { taskId, durationInSeconds: { not: null } },
                _sum: { durationInSeconds: true },
            }),
        ]);
        const activeLog = logs.find((l) => !l.endTime) ?? null;
        return {
            taskId,
            totalLoggedSeconds: aggregate._sum.durationInSeconds ?? 0,
            activeLog: activeLog ? this.toResponse(activeLog) : null,
            logs: logs.map((log) => this.toResponse(log)),
        };
    }
    async createManual(userId, dto) {
        await this.ensureTaskExists(dto.taskId);
        const startTime = new Date(dto.startTime);
        const endTime = new Date(dto.endTime);
        if (endTime <= startTime) {
            throw new common_1.BadRequestException('endTime must be after startTime');
        }
        const durationInSeconds = Math.round((endTime.getTime() - startTime.getTime()) / 1000);
        const log = await this.prisma.timeLog.create({
            data: {
                taskId: dto.taskId,
                userId,
                startTime,
                endTime,
                durationInSeconds,
                notes: dto.notes,
            },
            include: logInclude,
        });
        return this.toResponse(log);
    }
    async getTeamSummary() {
        const logs = await this.prisma.timeLog.findMany({
            where: { durationInSeconds: { not: null } },
            include: {
                user: { select: { id: true, name: true, avatarUrl: true, hourlyRate: true } },
                task: {
                    select: {
                        clientId: true,
                        client: { select: { id: true, companyName: true } },
                    },
                },
            },
        });
        const byMember = new Map();
        const byClient = new Map();
        for (const log of logs) {
            const seconds = log.durationInSeconds ?? 0;
            const member = byMember.get(log.userId) ?? {
                userId: log.userId,
                name: log.user.name,
                avatarUrl: log.user.avatarUrl,
                totalSeconds: 0,
                logCount: 0,
            };
            member.totalSeconds += seconds;
            member.logCount += 1;
            byMember.set(log.userId, member);
            const clientId = log.task.clientId;
            if (clientId && log.task.client) {
                const client = byClient.get(clientId) ?? {
                    clientId,
                    companyName: log.task.client.companyName,
                    totalSeconds: 0,
                    logCount: 0,
                };
                client.totalSeconds += seconds;
                client.logCount += 1;
                byClient.set(clientId, client);
            }
        }
        return {
            byMember: Array.from(byMember.values())
                .map((m) => ({
                ...m,
                totalHours: Math.round((m.totalSeconds / 3600) * 100) / 100,
            }))
                .sort((a, b) => b.totalSeconds - a.totalSeconds),
            byClient: Array.from(byClient.values())
                .map((c) => ({
                ...c,
                totalHours: Math.round((c.totalSeconds / 3600) * 100) / 100,
            }))
                .sort((a, b) => b.totalSeconds - a.totalSeconds),
        };
    }
    getDefaultHourlyRate() {
        return Number(this.config.get('DEFAULT_HOURLY_RATE', 150));
    }
    async getAverageHourlyRate() {
        const users = await this.prisma.user.findMany({
            where: { hourlyRate: { not: null } },
            select: { hourlyRate: true },
        });
        if (users.length === 0)
            return this.getDefaultHourlyRate();
        const total = users.reduce((sum, u) => sum + Number(u.hourlyRate), 0);
        return Math.round((total / users.length) * 100) / 100;
    }
    async stopLog(id, endTime) {
        const log = await this.prisma.timeLog.findUnique({ where: { id } });
        if (!log)
            throw new common_1.NotFoundException('Time log not found');
        const durationInSeconds = Math.round((endTime.getTime() - log.startTime.getTime()) / 1000);
        return this.prisma.timeLog.update({
            where: { id },
            data: { endTime, durationInSeconds },
            include: logInclude,
        });
    }
    async ensureTaskExists(taskId) {
        const task = await this.prisma.kanbanTask.findUnique({
            where: { id: taskId },
        });
        if (!task)
            throw new common_1.NotFoundException('Task not found');
        return task;
    }
    formatDuration(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0)
            return `${h}h ${m}m`;
        if (m > 0)
            return `${m}m ${s}s`;
        return `${s}s`;
    }
    toResponse(log) {
        const isRunning = !log.endTime;
        const elapsedSeconds = isRunning
            ? Math.round((Date.now() - log.startTime.getTime()) / 1000)
            : (log.durationInSeconds ?? 0);
        return {
            id: log.id,
            taskId: log.taskId,
            task: log.task,
            userId: log.userId,
            user: log.user,
            startTime: log.startTime.toISOString(),
            endTime: log.endTime?.toISOString() ?? null,
            durationInSeconds: log.durationInSeconds,
            elapsedSeconds,
            isRunning,
            notes: log.notes,
            createdAt: log.createdAt.toISOString(),
        };
    }
};
exports.TimeLogsService = TimeLogsService;
exports.TimeLogsService = TimeLogsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], TimeLogsService);
//# sourceMappingURL=time-logs.service.js.map