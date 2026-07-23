import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreateUserGroupDto,
  UpdateUserGroupDto,
} from '../users/dto/user.dto';
import { UserGroupsService } from './user-groups.service';

@Controller('user-groups')
@UseGuards(JwtAuthGuard)
export class UserGroupsController {
  constructor(private readonly userGroupsService: UserGroupsService) {}

  @Get()
  findAll() {
    return this.userGroupsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userGroupsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateUserGroupDto) {
    return this.userGroupsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserGroupDto) {
    return this.userGroupsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userGroupsService.remove(id);
  }
}
