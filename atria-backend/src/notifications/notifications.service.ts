import { Injectable } from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, unreadOnly = false) {
    const notifications = await this.prisma.notification.findMany({
      where: {
        userId,
        ...(unreadOnly ? { isRead: false } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return notifications.map((n) => this.toResponse(n));
  }

  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  async markAsRead(userId: string, id: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id, userId },
    });
    if (!notification) return null;

    const updated = await this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    return this.toResponse(updated);
  }

  async markAllAsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    return { success: true };
  }

  async notifyTaskAssigned(
    assigneeIds: string[],
    taskTitle: string,
    actorId: string,
  ) {
    const recipients = assigneeIds.filter((id) => id !== actorId);
    await this.createMany(
      recipients,
      NotificationType.TASK_ASSIGNED,
      'Nova tarefa atribuída',
      `Você foi atribuído à tarefa "${taskTitle}"`,
    );
  }

  async notifyContractSigned(
    userIds: string[],
    contractTitle: string,
    clientName: string,
  ) {
    await this.createMany(
      userIds,
      NotificationType.CONTRACT_SIGNED,
      'Contrato assinado',
      `O contrato "${contractTitle}" de ${clientName} foi assinado`,
    );
  }

  async notifyPostPending(
    userIds: string[],
    postTitle: string,
    clientName: string,
  ) {
    await this.createMany(
      userIds,
      NotificationType.POST_PENDING,
      'Post aguardando aprovação',
      `"${postTitle}" de ${clientName} está pendente de aprovação`,
    );
  }

  async notifyPostRejected(
    userIds: string[],
    postTitle: string,
    clientName: string,
    reason: string,
  ) {
    await this.createMany(
      userIds,
      NotificationType.POST_REJECTED,
      'Post rejeitado',
      `"${postTitle}" de ${clientName} foi rejeitado: ${reason.slice(0, 200)}`,
    );
  }

  private async createMany(
    userIds: string[],
    type: NotificationType,
    title: string,
    message: string,
  ) {
    const uniqueIds = [...new Set(userIds)].filter(Boolean);
    if (uniqueIds.length === 0) return;

    await this.prisma.notification.createMany({
      data: uniqueIds.map((userId) => ({
        userId,
        type,
        title,
        message,
      })),
    });
  }

  private toResponse(notification: {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    isRead: boolean;
    createdAt: Date;
  }) {
    return {
      id: notification.id,
      userId: notification.userId,
      title: notification.title,
      message: notification.message,
      type: notification.type.toLowerCase() as
        | 'task_assigned'
        | 'contract_signed'
        | 'post_pending'
        | 'post_rejected',
      isRead: notification.isRead,
      createdAt: notification.createdAt.toISOString(),
    };
  }
}
