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
import { CreateCommentDto } from './dto/comment.dto';
import {
  CreateColumnDto,
  ReorderColumnsDto,
  UpdateColumnDto,
} from './dto/column.dto';
import {
  CreateTaskDto,
  MoveTaskDto,
  QueryTasksDto,
  UpdateTaskDto,
} from './dto/task.dto';
import { KanbanService } from './kanban.service';

@Controller('kanban')
@UseGuards(JwtAuthGuard)
export class KanbanController {
  constructor(private readonly kanbanService: KanbanService) {}

  @Get('columns')
  getColumns() {
    return this.kanbanService.getColumns();
  }

  @Post('columns')
  createColumn(@Body() dto: CreateColumnDto) {
    return this.kanbanService.createColumn(dto);
  }

  @Patch('columns/reorder')
  reorderColumns(@Body() dto: ReorderColumnsDto) {
    return this.kanbanService.reorderColumns(dto);
  }

  @Patch('columns/:id')
  updateColumn(@Param('id') id: string, @Body() dto: UpdateColumnDto) {
    return this.kanbanService.updateColumn(id, dto);
  }

  @Delete('columns/:id')
  deleteColumn(@Param('id') id: string) {
    return this.kanbanService.deleteColumn(id);
  }

  @Get('tasks')
  getTasks(@Query() query: QueryTasksDto) {
    return this.kanbanService.getTasks(query);
  }

  @Get('tasks/:id')
  getTask(@Param('id') id: string) {
    return this.kanbanService.getTask(id);
  }

  @Post('tasks')
  createTask(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateTaskDto,
  ) {
    return this.kanbanService.createTask(user.userId, dto);
  }

  @Patch('tasks/:id')
  updateTask(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.kanbanService.updateTask(user.userId, id, dto);
  }

  @Patch('tasks/:id/move')
  moveTask(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: MoveTaskDto,
  ) {
    return this.kanbanService.moveTask(user.userId, id, dto);
  }

  @Delete('tasks/:id')
  deleteTask(@Param('id') id: string) {
    return this.kanbanService.deleteTask(id);
  }

  @Get('tasks/:id/comments')
  getComments(@Param('id') id: string) {
    return this.kanbanService.getComments(id);
  }

  @Post('tasks/:id/comments')
  createComment(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.kanbanService.createComment(user.userId, id, dto);
  }

  @Get('tasks/:id/history')
  getHistory(@Param('id') id: string) {
    return this.kanbanService.getHistory(id);
  }
}
