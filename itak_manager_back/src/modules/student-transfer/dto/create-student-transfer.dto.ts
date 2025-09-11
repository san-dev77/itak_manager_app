import { IsUUID, IsEnum, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { TransferReason } from '../../../entities/student-transfer.entity';

export class CreateStudentTransferDto {
  @IsUUID()
  studentId: string;

  @IsUUID()
  fromClassId: string;

  @IsUUID()
  toClassId: string;

  @IsDateString()
  transferDate: string;

  @IsEnum(TransferReason)
  reason: TransferReason;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  reasonDetails?: string;

  @IsString()
  @MaxLength(9)
  year: string; // ex: "2025-2026"

  @IsOptional()
  @IsUUID()
  approvedBy?: string;
}
