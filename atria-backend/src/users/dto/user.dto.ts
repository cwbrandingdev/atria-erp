import {
  IsEnum,
  IsHexColor,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { RoleName } from '@prisma/client';

export class CreateUserGroupDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @IsHexColor()
  @IsOptional()
  color?: string;
}

export class UpdateUserGroupDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @IsHexColor()
  @IsOptional()
  color?: string;
}

export class ProvisionUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsEnum(RoleName)
  role: RoleName;

  @IsString()
  @IsOptional()
  @IsUUID()
  userGroupId?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  hourlyRate?: number;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  emailDomain?: string;
}
