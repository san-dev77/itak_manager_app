import { IsEnum, IsOptional, IsString, IsArray, IsUUID } from 'class-validator';
import { VersionAction } from '../../../entities/assessment-version.entity';

export class CreateVersionDto {
  @IsUUID()
  assessmentId: string;

  @IsEnum(VersionAction)
  action: VersionAction;

  @IsUUID()
  changedBy: string;

  @IsOptional()
  @IsString()
  changeReason?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  changedFields?: string[];
}
