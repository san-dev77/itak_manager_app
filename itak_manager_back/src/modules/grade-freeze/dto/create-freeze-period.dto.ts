import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsUUID,
  IsBoolean,
  MinLength,
  MaxLength,
} from 'class-validator';
import { FreezeScope } from '../../../entities/grade-freeze-period.entity';

export class CreateFreezePeriodDto {
  @IsUUID()
  schoolYearId: string;

  @IsOptional()
  @IsUUID()
  termId?: string;

  @IsOptional()
  @IsUUID()
  classId?: string;

  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsEnum(FreezeScope)
  scope: FreezeScope;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsUUID()
  createdBy: string;

  @IsOptional()
  @IsBoolean()
  allowEmergencyOverride?: boolean;

  @IsOptional()
  @IsString()
  @MinLength(6)
  overridePassword?: string;
}
