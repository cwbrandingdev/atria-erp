import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateTimeLogDto,
  QueryTimeLogsDto,
  StartTimerDto,
  StopTimerDto,
} from './dto/time-log.dto';

const userSelect = { id: true, name: true, avatarUrl: true } as const;

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
} satisfies Prisma.TimeLogInclude;

type TimeLogWithRelations = Prisma.TimeLogGetPayload<{
  include: typeof logInclude;
}>;

@Injectable()
export class TimeLogsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async getActiveTimer(userId: string) {
    const active = await this.prisma.timeLog.findFirst({
      where: { userId, endTime: null },
      include: logInclude,
      orderBy: { startTime: 'desc' },
    });

    return active ? this.toResponse(active) : null;
  }

  async startTimer(userId: string, dto: StartTimerDto) {
    await this.ensureTaskExists(dto.taskId);

    const existing = await this.prisma.timeLog.findFirst({
      where: { userId, endTime: null },
    });

    if (existing) {
      if (existing.taskId === dto.taskId) {
        throw new BadRequestException('Timer already running for this task');
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

  async stopTimer(userId: string, dto: StopTimerDto) {
    const active = await this.prisma.timeLog.findFirst({
      where: { userId, taskId: dto.taskId, endTime: null },
      include: logInclude,
    });

    if (!active) {
      throw new NotFoundException('No active timer found for this task');
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

  async findAll(query: QueryTimeLogsDto) {
    const where: Prisma.TimeLogWhereInput = {
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

  async getTaskSummary(taskId: string) {
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

  async createManual(userId: string, dto: CreateTimeLogDto) {
    await this.ensureTaskExists(dto.taskId);

    const startTime = new Date(dto.startTime);
    const endTime = new Date(dto.endTime);

    if (endTime <= startTime) {
      throw new BadRequestException('endTime must be after startTime');
    }

    const durationInSeconds = Math.round(
      (endTime.getTime() - startTime.getTime()) / 1000,
    );

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

    const byMember = new Map<
      string,
      {
        userId: string;
        name: string;
        avatarUrl: string | null;
        totalSeconds: number;
        logCount: number;
      }
    >();

    const byClient = new Map<
      string,
      {
        clientId: string;
        companyName: string;
        totalSeconds: number;
        logCount: number;
      }
    >();

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

    if (users.length === 0) return this.getDefaultHourlyRate();

    const total = users.reduce(
      (sum, u) => sum + Number(u.hourlyRate),
      0,
    );
    return Math.round((total / users.length) * 100) / 100;
  }

  private async stopLog(id: string, endTime: Date) {
    const log = await this.prisma.timeLog.findUnique({ where: { id } });
    if (!log) throw new NotFoundException('Time log not found');

    const durationInSeconds = Math.round(
      (endTime.getTime() - log.startTime.getTime()) / 1000,
    );

    return this.prisma.timeLog.update({
      where: { id },
      data: { endTime, durationInSeconds },
      include: logInclude,
    });
  }

  private async ensureTaskExists(taskId: string) {
    const task = await this.prisma.kanbanTask.findUnique({
      where: { id: taskId },
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  private formatDuration(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  }

  private toResponse(log: TimeLogWithRelations) {
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
}
