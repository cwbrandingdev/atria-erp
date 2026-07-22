import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  CurrentUser,
  type AuthenticatedUser,
} from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CalendarService } from './calendar.service';
import {
  CreateEventDto,
  QueryEventsDto,
  UpdateEventDto,
} from './dto/event.dto';

@Controller('calendar')
@UseGuards(JwtAuthGuard)
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('members')
  getTeamMembers() {
    return this.calendarService.getTeamMembers();
  }

  @Get('events')
  getEvents(@Query() query: QueryEventsDto) {
    return this.calendarService.getEvents(query);
  }

  @Post('events')
  createEvent(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateEventDto,
  ) {
    return this.calendarService.createEvent(user.userId, dto);
  }

  @Patch('events/:id')
  updateEvent(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    return this.calendarService.updateEvent(id, dto);
  }

  @Delete('events/:id')
  deleteEvent(@Param('id') id: string) {
    return this.calendarService.deleteEvent(id);
  }
}
