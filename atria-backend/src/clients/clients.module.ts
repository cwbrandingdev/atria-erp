import { Module } from '@nestjs/common';
import { MetaInsightsModule } from '../meta-insights/meta-insights.module';
import { Client360Service } from './client-360.service';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';

@Module({
  imports: [MetaInsightsModule],
  controllers: [ClientsController],
  providers: [ClientsService, Client360Service],
  exports: [ClientsService],
})
export class ClientsModule {}
