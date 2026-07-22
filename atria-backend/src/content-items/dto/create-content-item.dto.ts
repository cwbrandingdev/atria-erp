import {
  IsDateString,
  IsNotEmpty,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';

export class CreateContentItemDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  legenda: string;

  @IsString()
  @IsNotEmpty()
  categoria: string;

  @IsString()
  @IsNotEmpty()
  projeto: string;

  @IsUrl()
  @IsNotEmpty()
  imageUrl: string;

  @IsDateString()
  scheduledDate: string;

  @IsUUID()
  clientId: string;
}
