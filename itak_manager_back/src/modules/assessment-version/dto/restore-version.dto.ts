import { IsOptional, IsString, IsUUID, IsInt, Min } from 'class-validator';

export class RestoreVersionDto {
  @IsInt()
  @Min(1)
  versionNumber: number;

  @IsUUID()
  restoredBy: string;

  @IsOptional()
  @IsString()
  restoreReason?: string;
}
