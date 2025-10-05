import {
  IsUUID,
  IsArray,
  ValidateNested,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AttendanceStatus } from '../../../entities/assessment-attendance.entity';

export class StudentAttendanceDto {
  @IsUUID()
  studentId: string;

  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}

export class BulkCreateAttendanceDto {
  @IsUUID()
  assessmentId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudentAttendanceDto)
  attendances: StudentAttendanceDto[];

  @IsOptional()
  @IsUUID()
  markedBy?: string;
}
