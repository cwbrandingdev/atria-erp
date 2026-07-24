import { IsUrl } from 'class-validator';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import {
  ContentPlatform,
  ContentPostFormat,
  ContentPostStatus,
} from '@prisma/client';

export class AttachmentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  url: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  mimeType?: string;
}

export class CreateContentPostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsUUID()
  clientId: string;

  @IsEnum(ContentPlatform)
  platform: ContentPlatform;

  @IsEnum(ContentPostFormat)
  @IsOptional()
  format?: ContentPostFormat;

  @IsDateString()
  @IsOptional()
  scheduledDate?: string;

  @IsEnum(ContentPostStatus)
  @IsOptional()
  status?: ContentPostStatus;

  @IsString()
  @IsNotEmpty()
  copy: string;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  @MaxLength(2048)
  referenceUrl?: string;

  @IsUUID()
  @IsOptional()
  assigneeId?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];
}

export class UpdateContentPostDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @IsUUID()
  @IsOptional()
  clientId?: string;

  @IsEnum(ContentPlatform)
  @IsOptional()
  platform?: ContentPlatform;

  @IsEnum(ContentPostFormat)
  @IsOptional()
  format?: ContentPostFormat;

  @IsDateString()
  @IsOptional()
  scheduledDate?: string | null;

  @IsEnum(ContentPostStatus)
  @IsOptional()
  status?: ContentPostStatus;

  @IsString()
  @IsOptional()
  copy?: string;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  @MaxLength(2048)
  referenceUrl?: string | null;

  @IsUUID()
  @IsOptional()
  assigneeId?: string | null;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];
}

export class QueryContentPostsDto {
  @IsOptional()
  @IsUUID()
  clientId?: string;

  @IsOptional()
  @IsEnum(ContentPlatform)
  platform?: ContentPlatform;

  @IsOptional()
  @IsEnum(ContentPostStatus)
  status?: ContentPostStatus;

  @IsDateString()
  @IsOptional()
  from?: string;

  @IsDateString()
  @IsOptional()
  to?: string;
}
