import { PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsUUID,
  IsDateString,
  Min,
} from 'class-validator';
import { FeeStatus } from '../../../entities/student-fee.entity';
import { FeeTypeResponseDto } from '../../fee-type/dto/fee-type.dto';
import { StudentResponseDto } from '../../student/dto/student.dto';

export class CreateStudentFeeDto {
  @IsUUID('4', { message: 'studentId doit être un UUID valide' })
  studentId: string;

  @IsUUID('4', { message: 'feeTypeId doit être un UUID valide' })
  feeTypeId: string;

  @IsUUID('4', { message: 'academicYearId doit être un UUID valide' })
  academicYearId: string;

  @IsNumber({}, { message: 'Le montant assigné doit être un nombre' })
  @Min(0, { message: 'Le montant assigné doit être positif' })
  amountAssigned: number;

  @IsOptional()
  @IsDateString(
    {},
    { message: "La date d'échéance doit être au format YYYY-MM-DD" },
  )
  dueDate?: string;

  @IsOptional()
  @IsEnum(FeeStatus, { message: 'Le statut doit être une valeur valide' })
  status?: FeeStatus;
}

export class UpdateStudentFeeDto extends PartialType(CreateStudentFeeDto) {}

export class PayStudentFeeDto {
  @IsNumber({}, { message: 'Le montant du paiement doit être un nombre' })
  @Min(0.01, { message: 'Le montant du paiement doit être supérieur à 0' })
  paymentAmount: number;
}

export class StudentFeeResponseDto {
  id: string;
  studentId: string;
  feeTypeId: string;
  academicYearId: string;
  amountAssigned: number;
  amountPaid: number; // Calculé dynamiquement
  dueDate?: string | Date;
  status: FeeStatus;
  createdAt: string | Date;
  updatedAt: string | Date;
  student?: StudentResponseDto;
  feeType?: FeeTypeResponseDto;
}

export class StudentFeesSummaryDto {
  studentId: string;
  totalAssigned: number;
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  fees: StudentFeeResponseDto[];
}
