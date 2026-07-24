import { Module } from '@nestjs/common';
import { MetaInsightsModule } from '../meta-insights/meta-insights.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';

@Module({
  imports: [NotificationsModule, MetaInsightsModule],
  controllers: [ContentController],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}
