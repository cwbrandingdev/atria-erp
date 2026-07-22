import { Module } from '@nestjs/common';
import { ProfitabilityService } from './profitability.service';
import {
  ProfitabilityController,
  TimeLogsController,
} from './timesheet.controller';
import { TimeLogsService } from './time-logs.service';

@Module({
  controllers: [TimeLogsController, ProfitabilityController],
  providers: [TimeLogsService, ProfitabilityService],
  exports: [TimeLogsService, ProfitabilityService],
})
export class TimesheetModule {}
