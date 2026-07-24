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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Client360Service } from './client-360.service';
import { ClientsService } from './clients.service';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';
import { Client360Section, QueryClient360Dto } from './dto/client-360.dto';

@Controller('clients')
@UseGuards(JwtAuthGuard)
export class ClientsController {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly client360Service: Client360Service,
  ) {}

  @Get()
  findAll(@Query('clientGroupId') clientGroupId?: string) {
    return this.clientsService.findAll(clientGroupId);
  }

  @Get(':id/360')
  getClient360(@Param('id') id: string, @Query() query: QueryClient360Dto) {
    return this.client360Service.getSection(
      id,
      query.section ?? Client360Section.SUMMARY,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateClientDto) {
    return this.clientsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateClientDto) {
    return this.clientsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientsService.remove(id);
  }
}
