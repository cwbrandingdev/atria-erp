import { IsNotEmpty, IsNumber, IsString, IsUrl, IsUUID } from 'class-validator';

export class CreateFileItemDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsUrl()
  @IsNotEmpty()
  fileUrl: string;

  @IsNumber()
  tamanho: number;

  @IsUUID()
  clientId: string;
}
