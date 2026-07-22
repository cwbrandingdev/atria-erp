import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { ContractStatus, PaymentFrequency } from '@prisma/client';

export class CreateContractDto {
  @IsUUID()
  clientId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsEnum(ContractStatus)
  @IsOptional()
  status?: ContractStatus;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  recurringValue: number;

  @IsEnum(PaymentFrequency)
  @IsOptional()
  paymentFrequency?: PaymentFrequency;

  @IsDateString()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsNotEmpty()
  termsContent: string;

  @IsUrl()
  @IsOptional()
  pdfUrl?: string;
}

export class UpdateContractDto {
  @IsUUID()
  @IsOptional()
  clientId?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @IsEnum(ContractStatus)
  @IsOptional()
  status?: ContractStatus;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @IsOptional()
  recurringValue?: number;

  @IsEnum(PaymentFrequency)
  @IsOptional()
  paymentFrequency?: PaymentFrequency;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string | null;

  @IsString()
  @IsOptional()
  termsContent?: string;

  @IsUrl()
  @IsOptional()
  pdfUrl?: string | null;
}

export class QueryContractsDto {
  @IsOptional()
  @IsUUID()
  clientId?: string;

  @IsOptional()
  @IsEnum(ContractStatus)
  status?: ContractStatus;
}
