import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class StartTimerDto {
  @IsUUID()
  taskId: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}

export class StopTimerDto {
  @IsUUID()
  taskId: string;
}

export class CreateTimeLogDto {
  @IsUUID()
  taskId: string;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}

export class QueryTimeLogsDto {
  @IsOptional()
  @IsUUID()
  taskId?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsUUID()
  clientId?: string;
}
