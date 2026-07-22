import { Module } from '@nestjs/common';
import { MetaInsightsModule } from '../meta-insights/meta-insights.module';
import { PortalController } from './portal.controller';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  imports: [MetaInsightsModule],
  controllers: [ReportsController, PortalController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
