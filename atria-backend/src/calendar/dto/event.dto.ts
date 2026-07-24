import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { EventCategory } from '@prisma/client';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @IsDateString()
  startAt: string;

  @IsDateString()
  endAt: string;

  @IsEnum(EventCategory)
  @IsOptional()
  category?: EventCategory;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  color?: string;

  @IsBoolean()
  @IsOptional()
  isPending?: boolean;

  @IsUUID()
  @IsOptional()
  assigneeId?: string;

  @IsUUID()
  @IsOptional()
  clientId?: string;

  @ValidateIf((_, value) => value !== undefined && value !== null && value !== '')
  @IsUrl({ require_protocol: true })
  @MaxLength(2048)
  @IsOptional()
  referenceUrl?: string;
}

export class UpdateEventDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @IsDateString()
  @IsOptional()
  startAt?: string;

  @IsDateString()
  @IsOptional()
  endAt?: string;

  @IsEnum(EventCategory)
  @IsOptional()
  category?: EventCategory;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  color?: string;

  @IsBoolean()
  @IsOptional()
  isPending?: boolean;

  @IsUUID()
  @IsOptional()
  assigneeId?: string | null;

  @IsUUID()
  @IsOptional()
  clientId?: string | null;

  @ValidateIf((_, value) => value !== undefined && value !== null && value !== '')
  @IsUrl({ require_protocol: true })
  @MaxLength(2048)
  @IsOptional()
  referenceUrl?: string | null;
}

export class QueryEventsDto {
  @IsDateString()
  @IsOptional()
  from?: string;

  @IsDateString()
  @IsOptional()
  to?: string;

  @IsUUID()
  @IsOptional()
  clientId?: string;
}
