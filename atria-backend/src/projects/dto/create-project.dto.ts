import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsUUID()
  clientId: string;
}
