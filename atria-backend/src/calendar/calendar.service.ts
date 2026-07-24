import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

const CLIENT_COLORS = [
  '#8B5CF6',
  '#06B6D4',
  '#3B82F6',
  '#F97316',
  '#EC4899',
  '#10B981',
  '#F59E0B',
  '#6366F1',
  '#14B8A6',
  '#EF4444',
];

const eventInclude = {
  createdBy: { select: { id: true, name: true, avatarUrl: true } },
  assignee: { select: { id: true, name: true, avatarUrl: true } },
  client: {
    select: {
      id: true,
      companyName: true,
      avatarUrl: true,
    },
  },
} satisfies Prisma.CalendarEventInclude;

type EventWithRelations = Prisma.CalendarEventGetPayload<{
  include: typeof eventInclude;
}>;

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

    if (query.clientId) {
      where.clientId = query.clientId;
    }

    const events = await this.prisma.calendarEvent.findMany({
      where,
      include: eventInclude,
      orderBy: { startAt: 'asc' },
    });

    return events.map((event) => this.toEventResponse(event));
  }

  async createEvent(userId: string, dto: CreateEventDto) {
    if (dto.clientId) {
      await this.ensureClientExists(dto.clientId);
    }

    const event = await this.prisma.calendarEvent.create({
      data: {
        title: dto.title,
        description: dto.description,
        startAt: new Date(dto.startAt),
        endAt: new Date(dto.endAt),
        category: dto.category,
        color: dto.color,
        referenceUrl: dto.referenceUrl,
        isPending: dto.isPending ?? false,
        assigneeId: dto.assigneeId,
        clientId: dto.clientId,
        createdById: userId,
      },
      include: eventInclude,
    });

    return this.toEventResponse(event);
  }

  async updateEvent(id: string, dto: UpdateEventDto) {
    await this.ensureEventExists(id);

    if (dto.clientId) {
      await this.ensureClientExists(dto.clientId);
    }

    const event = await this.prisma.calendarEvent.update({
      where: { id },
      data: {
        ...dto,
        startAt: dto.startAt ? new Date(dto.startAt) : undefined,
        endAt: dto.endAt ? new Date(dto.endAt) : undefined,
        assigneeId: dto.assigneeId === null ? null : dto.assigneeId,
        clientId: dto.clientId === null ? null : dto.clientId,
        referenceUrl:
          dto.referenceUrl === null || dto.referenceUrl === ''
            ? null
            : dto.referenceUrl,
      },
      include: eventInclude,
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

  private async ensureClientExists(id: string) {
    const client = await this.prisma.client.findUnique({ where: { id } });
    if (!client) throw new NotFoundException('Client not found');
    return client;
  }

  private getClientColor(clientId: string) {
    let hash = 0;
    for (let i = 0; i < clientId.length; i++) {
      hash = clientId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return CLIENT_COLORS[Math.abs(hash) % CLIENT_COLORS.length];
  }

  private toEventResponse(event: EventWithRelations) {
    const clientColor = event.client
      ? this.getClientColor(event.client.id)
      : null;

    return {
      id: event.id,
      title: event.title,
      description: event.description,
      startAt: event.startAt.toISOString(),
      endAt: event.endAt.toISOString(),
      category: event.category.toLowerCase(),
      color:
        clientColor ??
        event.color ??
        CATEGORY_COLORS[event.category] ??
        '#004949',
      referenceUrl: event.referenceUrl,
      isPending: event.isPending,
      clientId: event.clientId,
      client: event.client
        ? {
            id: event.client.id,
            companyName: event.client.companyName,
            avatarUrl: event.client.avatarUrl,
            color: clientColor!,
          }
        : null,
      createdBy: event.createdBy,
      assignee: event.assignee,
    };
  }
}
