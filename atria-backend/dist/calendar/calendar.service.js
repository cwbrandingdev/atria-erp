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
exports.CalendarService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const CATEGORY_COLORS = {
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
let CalendarService = class CalendarService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
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
    async getEvents(query) {
        const where = {};
        if (query.from || query.to) {
            where.startAt = {};
            if (query.from)
                where.startAt.gte = new Date(query.from);
            if (query.to)
                where.startAt.lte = new Date(query.to);
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
    async createEvent(userId, dto) {
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
    async updateEvent(id, dto) {
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
    async deleteEvent(id) {
        await this.ensureEventExists(id);
        await this.prisma.calendarEvent.delete({ where: { id } });
    }
    async ensureEventExists(id) {
        const event = await this.prisma.calendarEvent.findUnique({ where: { id } });
        if (!event)
            throw new common_1.NotFoundException('Event not found');
        return event;
    }
    toEventResponse(event) {
        return {
            id: event.id,
            title: event.title,
            description: event.description,
            startAt: event.startAt.toISOString(),
            endAt: event.endAt.toISOString(),
            category: event.category.toLowerCase(),
            color: event.color ??
                CATEGORY_COLORS[event.category] ??
                '#004949',
            isPending: event.isPending,
            createdBy: event.createdBy,
            assignee: event.assignee,
        };
    }
};
exports.CalendarService = CalendarService;
exports.CalendarService = CalendarService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CalendarService);
//# sourceMappingURL=calendar.service.js.map