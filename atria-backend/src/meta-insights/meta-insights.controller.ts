import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateCampaignStatusDto } from './dto/update-campaign-status.dto';
import { MetaInsightsService } from './meta-insights.service';

@Controller('insights')
@UseGuards(JwtAuthGuard)
export class MetaInsightsController {
  constructor(private readonly metaInsightsService: MetaInsightsService) {}

  @Get('overview')
  getOverview() {
    return this.metaInsightsService.getOverview();
  }

  @Get('performance')
  getPerformance() {
    return this.metaInsightsService.getPerformanceChart();
  }

  @Get('campaigns')
  getCampaigns() {
    return this.metaInsightsService.getCampaigns();
  }

  @Patch('campaigns/:id')
  updateCampaign(
    @Param('id') id: string,
    @Body() dto: UpdateCampaignStatusDto,
  ) {
    return this.metaInsightsService.updateCampaignStatus(id, dto.status);
  }
}
