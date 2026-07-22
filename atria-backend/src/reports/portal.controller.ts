import { Controller, Get, Param } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('portal')
export class PortalController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get(':token')
  getPortalData(@Param('token') token: string) {
    return this.reportsService.getPortalData(token);
  }

  @Get(':token/reports/:reportId')
  getPortalReport(
    @Param('token') token: string,
    @Param('reportId') reportId: string,
  ) {
    return this.reportsService.getPortalReport(token, reportId);
  }
}
