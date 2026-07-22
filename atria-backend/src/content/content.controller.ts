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
import { ContentService } from './content.service';
import {
  CreateContentPostDto,
  QueryContentPostsDto,
  UpdateContentPostDto,
} from './dto/content-post.dto';

@Controller('content')
@UseGuards(JwtAuthGuard)
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('overview')
  getOverview(@Query('clientId') clientId?: string) {
    return this.contentService.getOverview(clientId);
  }

  @Get('calendar')
  getCalendar(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('clientId') clientId?: string,
  ) {
    return this.contentService.getCalendarOverview(from, to, clientId);
  }

  @Get('posts')
  getPosts(@Query() query: QueryContentPostsDto) {
    return this.contentService.getPosts(query);
  }

  @Post('posts')
  createPost(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateContentPostDto,
  ) {
    return this.contentService.createPost(user.userId, dto);
  }

  @Patch('posts/:id')
  updatePost(@Param('id') id: string, @Body() dto: UpdateContentPostDto) {
    return this.contentService.updatePost(id, dto);
  }

  @Delete('posts/:id')
  deletePost(@Param('id') id: string) {
    return this.contentService.deletePost(id);
  }
}
