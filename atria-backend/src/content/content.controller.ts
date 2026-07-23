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
import {
  CreatePostVersionDto,
  RejectContentPostDto,
} from './dto/content-workflow.dto';

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

  @Get('posts/:id/history')
  getPostHistory(@Param('id') id: string) {
    return this.contentService.getPostHistory(id);
  }

  @Get('posts/:id')
  getPost(@Param('id') id: string) {
    return this.contentService.getPostById(id);
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

  @Post('posts/:id/versions')
  createVersion(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreatePostVersionDto,
  ) {
    return this.contentService.createVersion(id, user.userId, dto);
  }

  @Patch('posts/:id/approve')
  approvePost(@Param('id') id: string) {
    return this.contentService.approvePost(id);
  }

  @Patch('posts/:id/reject')
  rejectPost(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: RejectContentPostDto,
  ) {
    return this.contentService.rejectPost(id, user.userId, dto);
  }

  @Delete('posts/:id')
  deletePost(@Param('id') id: string) {
    return this.contentService.deletePost(id);
  }
}
