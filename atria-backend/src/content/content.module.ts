import { Module } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';

@Module({
  imports: [NotificationsModule],
  controllers: [ContentController],
  providers: [ContentService],
})
export class ContentModule {}
