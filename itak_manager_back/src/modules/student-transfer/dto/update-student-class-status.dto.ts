import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { StudentClassStatus } from '../../../entities/student-class.entity';

export class UpdateStudentClassStatusDto {
  @IsEnum(StudentClassStatus)
  status: StudentClassStatus;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  statusReason?: string;
}
