import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  CurrentUser,
  type AuthenticatedUser,
} from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreateTimeLogDto,
  QueryTimeLogsDto,
  StartTimerDto,
  StopTimerDto,
} from './dto/time-log.dto';
import { ProfitabilityService } from './profitability.service';
import { TimeLogsService } from './time-logs.service';

@Controller('time-logs')
@UseGuards(JwtAuthGuard)
export class TimeLogsController {
  constructor(private readonly timeLogsService: TimeLogsService) {}

  @Get()
  findAll(@Query() query: QueryTimeLogsDto) {
    return this.timeLogsService.findAll(query);
  }

  @Get('active')
  getActive(@CurrentUser() user: AuthenticatedUser) {
    return this.timeLogsService.getActiveTimer(user.userId);
  }

  @Get('summary')
  getTeamSummary() {
    return this.timeLogsService.getTeamSummary();
  }

  @Get('task/:taskId')
  getTaskSummary(@Param('taskId') taskId: string) {
    return this.timeLogsService.getTaskSummary(taskId);
  }

  @Post('start')
  start(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: StartTimerDto,
  ) {
    return this.timeLogsService.startTimer(user.userId, dto);
  }

  @Post('stop')
  stop(@CurrentUser() user: AuthenticatedUser, @Body() dto: StopTimerDto) {
    return this.timeLogsService.stopTimer(user.userId, dto);
  }

  @Post()
  createManual(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateTimeLogDto,
  ) {
    return this.timeLogsService.createManual(user.userId, dto);
  }
}

@Controller('profitability')
@UseGuards(JwtAuthGuard)
export class ProfitabilityController {
  constructor(private readonly profitabilityService: ProfitabilityService) {}

  @Get('overview')
  getOverview() {
    return this.profitabilityService.getOverview();
  }

  @Get('clients')
  getClients() {
    return this.profitabilityService.getClientProfitability();
  }
}
