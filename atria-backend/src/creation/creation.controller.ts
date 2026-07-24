import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  CurrentUser,
  type AuthenticatedUser,
} from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreationService } from './creation.service';
import {
  CreateBriefPlanDto,
  GenerateBriefPlanDto,
} from './dto/brief-to-content.dto';

@Controller('creation')
@UseGuards(JwtAuthGuard)
export class CreationController {
  constructor(private readonly creationService: CreationService) {}

  @Get('command-center')
  getCommandCenter() {
    return this.creationService.getCommandCenter();
  }

  @Post('brief-to-content/generate')
  generateFromBrief(@Body() dto: GenerateBriefPlanDto) {
    return this.creationService.generateFromBrief(dto);
  }

  @Post('brief-to-content/create')
  createFromBriefPlan(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateBriefPlanDto,
  ) {
    return this.creationService.createFromBriefPlan(user.userId, dto);
  }
}
