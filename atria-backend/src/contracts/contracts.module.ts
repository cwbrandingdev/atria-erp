import { Module } from '@nestjs/common';
import { FinanceModule } from '../finance/finance.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ContractsController } from './contracts.controller';
import { ContractsPdfService } from './contracts-pdf.service';
import { ContractsService } from './contracts.service';

@Module({
  imports: [FinanceModule, NotificationsModule],
  controllers: [ContractsController],
  providers: [ContractsService, ContractsPdfService],
})
export class ContractsModule {}
