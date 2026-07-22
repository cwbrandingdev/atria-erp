import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { KanbanTaskPriority } from '@prisma/client';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(5000)
  description?: string;

  @IsUUID()
  columnId: string;

  @IsEnum(KanbanTaskPriority)
  @IsOptional()
  priority?: KanbanTaskPriority;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  assigneeIds?: string[];

  @IsUUID()
  @IsOptional()
  clientId?: string;
}

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(5000)
  description?: string;

  @IsUUID()
  @IsOptional()
  columnId?: string;

  @IsEnum(KanbanTaskPriority)
  @IsOptional()
  priority?: KanbanTaskPriority;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === null) return [];
    if (Array.isArray(value)) return value;
    return undefined;
  })
  @IsArray()
  @IsUUID('4', { each: true })
  assigneeIds?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  order?: number;

  @IsUUID()
  @IsOptional()
  clientId?: string | null;
}

export class MoveTaskDto {
  @IsUUID()
  columnId: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  order: number;
}

export class QueryTasksDto {
  @IsOptional()
  @IsUUID()
  columnId?: string;
}
