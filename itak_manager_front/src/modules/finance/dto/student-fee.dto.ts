import {
  IsString,
  IsNumber,
  IsDateString,
  IsEnum,
  IsOptional,
  Min,
  IsUUID,
} from "class-validator";
import { StudentFeeStatus } from "../entities/student-fee.entity";

export class CreateStudentFeeDto {
  @IsUUID()
  studentId: string;

  @IsUUID()
  feeTypeId: string;

  @IsUUID()
  academicYearId: string;

  @IsNumber()
  @Min(0)
  amountAssigned: number;

  @IsDateString()
  dueDate: string;
}

export class UpdateStudentFeeDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  amountAssigned?: number;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsEnum(StudentFeeStatus)
  status?: StudentFeeStatus;
}

export class AssignFeesToStudentDto {
  @IsUUID()
  studentId: string;

  @IsUUID()
  academicYearId: string;

  @IsUUID()
  feeTypeId: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  customAmount?: number;

  @IsDateString()
  dueDate: string;
}
