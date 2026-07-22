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
exports.KanbanService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const userSelect = { id: true, name: true, avatarUrl: true };
const clientSelect = {
    id: true,
    companyName: true,
    avatarUrl: true,
};
const taskInclude = {
    column: true,
    client: { select: clientSelect },
    createdBy: { select: userSelect },
    assignees: { include: { user: { select: userSelect } } },
};
const PRIORITY_LABELS = {
    CRITICAL: 'Crítica',
    HIGH: 'Alta',
    MEDIUM: 'Média',
    LOW: 'Baixa',
    PLANNED: 'Planejado',
};
let KanbanService = class KanbanService {
    prisma;
    notifications;
    constructor(prisma, notifications) {
        this.prisma = prisma;
        this.notifications = notifications;
    }
    async getColumns() {
        const columns = await this.prisma.kanbanColumn.findMany({
            orderBy: { order: 'asc' },
        });
        return columns.map((column) => this.toColumnResponse(column));
    }
    async createColumn(dto) {
        const maxOrder = await this.prisma.kanbanColumn.aggregate({
            _max: { order: true },
        });
        const column = await this.prisma.kanbanColumn.create({
            data: {
                title: dto.title,
                color: dto.color ?? '#004949',
                order: (maxOrder._max.order ?? -1) + 1,
            },
        });
        return this.toColumnResponse(column);
    }
    async updateColumn(id, dto) {
        await this.ensureColumnExists(id);
        const column = await this.prisma.kanbanColumn.update({
            where: { id },
            data: dto,
        });
        return this.toColumnResponse(column);
    }
    async deleteColumn(id) {
        await this.ensureColumnExists(id);
        const taskCount = await this.prisma.kanbanTask.count({
            where: { columnId: id },
        });
        if (taskCount > 0) {
            throw new common_1.BadRequestException('Cannot delete a column that contains tasks');
        }
        await this.prisma.kanbanColumn.delete({ where: { id } });
    }
    async reorderColumns(dto) {
        await this.prisma.$transaction(dto.items.map((item) => this.prisma.kanbanColumn.update({
            where: { id: item.id },
            data: { order: item.order },
        })));
        return this.getColumns();
    }
    async getTasks(query) {
        const tasks = await this.prisma.kanbanTask.findMany({
            where: query.columnId ? { columnId: query.columnId } : undefined,
            include: this.taskInclude(),
            orderBy: [{ columnId: 'asc' }, { order: 'asc' }],
        });
        const taskIds = tasks.map((t) => t.id);
        const aggregates = taskIds.length > 0
            ? await this.prisma.timeLog.groupBy({
                by: ['taskId'],
                where: {
                    taskId: { in: taskIds },
                    durationInSeconds: { not: null },
                },
                _sum: { durationInSeconds: true },
            })
            : [];
        const secondsByTask = new Map(aggregates.map((a) => [a.taskId, a._sum.durationInSeconds ?? 0]));
        return tasks.map((task) => this.toTaskResponse(task, secondsByTask.get(task.id) ?? 0));
    }
    async getTask(id) {
        const task = await this.ensureTaskExists(id);
        const total = await this.getTaskLoggedSeconds(id);
        return this.toTaskResponse(task, total);
    }
    async createTask(userId, dto) {
        await this.ensureColumnExists(dto.columnId);
        await this.validateAssignees(dto.assigneeIds);
        if (dto.clientId)
            await this.ensureClientExists(dto.clientId);
        const maxOrder = await this.prisma.kanbanTask.aggregate({
            where: { columnId: dto.columnId },
            _max: { order: true },
        });
        const task = await this.prisma.kanbanTask.create({
            data: {
                title: dto.title,
                description: dto.description,
                columnId: dto.columnId,
                clientId: dto.clientId,
                priority: dto.priority ?? client_1.KanbanTaskPriority.MEDIUM,
                dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
                createdById: userId,
                order: (maxOrder._max.order ?? -1) + 1,
                assignees: dto.assigneeIds?.length
                    ? {
                        create: dto.assigneeIds.map((assigneeId) => ({
                            userId: assigneeId,
                        })),
                    }
                    : undefined,
            },
            include: this.taskInclude(),
        });
        await this.logHistory(userId, task.id, 'Tarefa criada');
        if (dto.assigneeIds?.length) {
            const names = task.assignees.map((a) => a.user.name).join(', ');
            await this.logHistory(userId, task.id, `Atribuída a ${names}`);
            await this.notifications.notifyTaskAssigned(dto.assigneeIds, task.title, userId);
        }
        return this.toTaskResponse(task, 0);
    }
    async updateTask(userId, id, dto) {
        const existing = await this.ensureTaskExists(id);
        if (dto.columnId) {
            await this.ensureColumnExists(dto.columnId);
        }
        if (dto.assigneeIds) {
            await this.validateAssignees(dto.assigneeIds);
        }
        if (dto.clientId !== undefined && dto.clientId !== null) {
            await this.ensureClientExists(dto.clientId);
        }
        const task = await this.prisma.$transaction(async (tx) => {
            if (dto.assigneeIds) {
                await tx.kanbanTaskAssignee.deleteMany({ where: { taskId: id } });
                if (dto.assigneeIds.length > 0) {
                    await tx.kanbanTaskAssignee.createMany({
                        data: dto.assigneeIds.map((assigneeId) => ({
                            taskId: id,
                            userId: assigneeId,
                        })),
                    });
                }
            }
            return tx.kanbanTask.update({
                where: { id },
                data: {
                    title: dto.title,
                    description: dto.description,
                    columnId: dto.columnId,
                    clientId: dto.clientId,
                    priority: dto.priority,
                    order: dto.order,
                    dueDate: dto.dueDate !== undefined
                        ? dto.dueDate
                            ? new Date(dto.dueDate)
                            : null
                        : undefined,
                },
                include: this.taskInclude(),
            });
        });
        await this.logTaskChanges(userId, existing, task, dto);
        const total = await this.getTaskLoggedSeconds(id);
        return this.toTaskResponse(task, total);
    }
    async moveTask(userId, id, dto) {
        const task = await this.ensureTaskExists(id);
        const targetColumn = await this.ensureColumnExists(dto.columnId);
        if (task.columnId !== dto.columnId) {
            await this.prisma.kanbanTask.updateMany({
                where: {
                    columnId: dto.columnId,
                    order: { gte: dto.order },
                    id: { not: id },
                },
                data: { order: { increment: 1 } },
            });
        }
        const updated = await this.prisma.kanbanTask.update({
            where: { id },
            data: { columnId: dto.columnId, order: dto.order },
            include: this.taskInclude(),
        });
        if (task.columnId !== dto.columnId) {
            await this.logHistory(userId, id, `Movida para ${targetColumn.title}`);
        }
        const total = await this.getTaskLoggedSeconds(id);
        return this.toTaskResponse(updated, total);
    }
    async deleteTask(id) {
        await this.ensureTaskExists(id);
        await this.prisma.kanbanTask.delete({ where: { id } });
    }
    async getComments(taskId) {
        await this.ensureTaskExists(taskId);
        const comments = await this.prisma.taskComment.findMany({
            where: { taskId },
            include: { user: { select: userSelect } },
            orderBy: { createdAt: 'asc' },
        });
        return comments.map((comment) => ({
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt.toISOString(),
            user: comment.user,
        }));
    }
    async createComment(userId, taskId, dto) {
        await this.ensureTaskExists(taskId);
        const comment = await this.prisma.taskComment.create({
            data: {
                taskId,
                userId,
                content: dto.content,
            },
            include: { user: { select: userSelect } },
        });
        await this.logHistory(userId, taskId, 'Comentário adicionado');
        return {
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt.toISOString(),
            user: comment.user,
        };
    }
    async getHistory(taskId) {
        await this.ensureTaskExists(taskId);
        const history = await this.prisma.taskHistory.findMany({
            where: { taskId },
            include: { user: { select: userSelect } },
            orderBy: { createdAt: 'desc' },
        });
        return history.map((entry) => ({
            id: entry.id,
            action: entry.action,
            createdAt: entry.createdAt.toISOString(),
            user: entry.user,
        }));
    }
    taskInclude() {
        return taskInclude;
    }
    async ensureColumnExists(id) {
        const column = await this.prisma.kanbanColumn.findUnique({
            where: { id },
        });
        if (!column)
            throw new common_1.NotFoundException('Column not found');
        return column;
    }
    async ensureTaskExists(id) {
        const task = await this.prisma.kanbanTask.findUnique({
            where: { id },
            include: this.taskInclude(),
        });
        if (!task)
            throw new common_1.NotFoundException('Task not found');
        return task;
    }
    async validateAssignees(assigneeIds) {
        if (!assigneeIds?.length)
            return;
        const users = await this.prisma.user.findMany({
            where: { id: { in: assigneeIds } },
            select: { id: true },
        });
        if (users.length !== assigneeIds.length) {
            throw new common_1.BadRequestException('One or more assignees were not found');
        }
    }
    async ensureClientExists(clientId) {
        const client = await this.prisma.client.findUnique({
            where: { id: clientId },
        });
        if (!client)
            throw new common_1.NotFoundException('Client not found');
    }
    async getTaskLoggedSeconds(taskId) {
        const result = await this.prisma.timeLog.aggregate({
            where: { taskId, durationInSeconds: { not: null } },
            _sum: { durationInSeconds: true },
        });
        return result._sum.durationInSeconds ?? 0;
    }
    async logHistory(userId, taskId, action) {
        await this.prisma.taskHistory.create({
            data: { userId, taskId, action },
        });
    }
    async logTaskChanges(userId, before, after, dto) {
        const logs = [];
        if (dto.title && dto.title !== before.title) {
            logs.push(`Título atualizado para "${dto.title}"`);
        }
        if (dto.priority && dto.priority !== before.priority) {
            logs.push(`Prioridade alterada para ${PRIORITY_LABELS[dto.priority]}`);
        }
        if (dto.columnId && dto.columnId !== before.columnId) {
            logs.push(`Movida para ${after.column.title}`);
        }
        if (dto.assigneeIds) {
            const beforeIds = before.assignees.map((a) => a.user.id).sort();
            const afterIds = after.assignees.map((a) => a.user.id).sort();
            if (beforeIds.join(',') !== afterIds.join(',')) {
                const names = after.assignees.map((a) => a.user.name).join(', ') || 'ninguém';
                logs.push(`Responsáveis atualizados: ${names}`);
                const newAssignees = afterIds.filter((id) => !beforeIds.includes(id));
                if (newAssignees.length > 0) {
                    await this.notifications.notifyTaskAssigned(newAssignees, after.title, userId);
                }
            }
        }
        if (dto.dueDate !== undefined) {
            logs.push('Data de prazo atualizada');
        }
        for (const action of logs) {
            await this.logHistory(userId, before.id, action);
        }
    }
    toColumnResponse(column) {
        return {
            id: column.id,
            title: column.title,
            order: column.order,
            color: column.color,
        };
    }
    toTaskResponse(task, totalLoggedSeconds) {
        return {
            id: task.id,
            title: task.title,
            description: task.description,
            columnId: task.columnId,
            column: this.toColumnResponse(task.column),
            clientId: task.clientId,
            client: task.client,
            priority: task.priority.toLowerCase(),
            order: task.order,
            dueDate: task.dueDate?.toISOString() ?? null,
            assignees: task.assignees.map((a) => a.user),
            createdBy: task.createdBy,
            totalLoggedSeconds,
            createdAt: task.createdAt.toISOString(),
            updatedAt: task.updatedAt.toISOString(),
        };
    }
};
exports.KanbanService = KanbanService;
exports.KanbanService = KanbanService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], KanbanService);
//# sourceMappingURL=kanban.service.js.map