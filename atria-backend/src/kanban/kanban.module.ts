import { Module } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module';
import { KanbanController } from './kanban.controller';
import { KanbanService } from './kanban.service';

@Module({
  imports: [NotificationsModule],
  controllers: [KanbanController],
  providers: [KanbanService],
  exports: [KanbanService],
})
export class KanbanModule {}
