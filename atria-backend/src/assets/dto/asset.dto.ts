import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { AssetFileType } from '@prisma/client';

export class QueryAssetsDto {
  @IsOptional()
  @IsUUID()
  clientId?: string;

  @IsOptional()
  @IsEnum(AssetFileType)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  fileType?: AssetFileType;
}

export class CreateAssetDto {
  @IsUUID()
  clientId: string;

  @IsEnum(AssetFileType)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  fileType: AssetFileType;
}
