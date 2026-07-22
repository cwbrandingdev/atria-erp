import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateEventDto,
  QueryEventsDto,
  UpdateEventDto,
} from './dto/event.dto';

const CATEGORY_COLORS: Record<string, string> = {
  MEETING: '#004949',
  DEADLINE: '#E8C39E',
  PUBLISH: '#006666',
  OTHER: '#8B7355',
};

const MEMBER_COLORS = [
  '#004949',
  '#E8C39E',
  '#006666',
  '#2D6A6A',
  '#8B7355',
  '#C4A882',
];

@Injectable()
export class CalendarService {
  constructor(private readonly prisma: PrismaService) {}

  async getTeamMembers() {
    const users = await this.prisma.user.findMany({
      select: { id: true, name: true, email: true, avatarUrl: true },
      orderBy: { name: 'asc' },
    });

    return users.map((user, index) => ({
      ...user,
      color: MEMBER_COLORS[index % MEMBER_COLORS.length],
    }));
  }

  async getEvents(query: QueryEventsDto) {
    const where: Prisma.CalendarEventWhereInput = {};

    if (query.from || query.to) {
      where.startAt = {};
      if (query.from) where.startAt.gte = new Date(query.from);
      if (query.to) where.startAt.lte = new Date(query.to);
    }

    const events = await this.prisma.calendarEvent.findMany({
      where,
      include: {
        createdBy: { select: { id: true, name: true, avatarUrl: true } },
        assignee: { select: { id: true, name: true, avatarUrl: true } },
      },
      orderBy: { startAt: 'asc' },
    });

    return events.map((event) => this.toEventResponse(event));
  }

  async createEvent(userId: string, dto: CreateEventDto) {
    const event = await this.prisma.calendarEvent.create({
      data: {
        title: dto.title,
        description: dto.description,
        startAt: new Date(dto.startAt),
        endAt: new Date(dto.endAt),
        category: dto.category,
        color: dto.color,
        isPending: dto.isPending ?? false,
        assigneeId: dto.assigneeId,
        createdById: userId,
      },
      include: {
        createdBy: { select: { id: true, name: true, avatarUrl: true } },
        assignee: { select: { id: true, name: true, avatarUrl: true } },
      },
    });

    return this.toEventResponse(event);
  }

  async updateEvent(id: string, dto: UpdateEventDto) {
    await this.ensureEventExists(id);

    const event = await this.prisma.calendarEvent.update({
      where: { id },
      data: {
        ...dto,
        startAt: dto.startAt ? new Date(dto.startAt) : undefined,
        endAt: dto.endAt ? new Date(dto.endAt) : undefined,
        assigneeId: dto.assigneeId === null ? null : dto.assigneeId,
      },
      include: {
        createdBy: { select: { id: true, name: true, avatarUrl: true } },
        assignee: { select: { id: true, name: true, avatarUrl: true } },
      },
    });

    return this.toEventResponse(event);
  }

  async deleteEvent(id: string) {
    await this.ensureEventExists(id);
    await this.prisma.calendarEvent.delete({ where: { id } });
  }

  private async ensureEventExists(id: string) {
    const event = await this.prisma.calendarEvent.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  private toEventResponse(event: {
    id: string;
    title: string;
    description: string | null;
    startAt: Date;
    endAt: Date;
    category: string;
    color: string | null;
    isPending: boolean;
    createdBy: { id: string; name: string; avatarUrl: string | null };
    assignee: { id: string; name: string; avatarUrl: string | null } | null;
  }) {
    return {
      id: event.id,
      title: event.title,
      description: event.description,
      startAt: event.startAt.toISOString(),
      endAt: event.endAt.toISOString(),
      category: event.category.toLowerCase(),
      color:
        event.color ??
        CATEGORY_COLORS[event.category] ??
        '#004949',
      isPending: event.isPending,
      createdBy: event.createdBy,
      assignee: event.assignee,
    };
  }
}
