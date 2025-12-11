import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsDateString, IsUUID } from 'class-validator';
import { CreateStudentTransferDto } from './create-student-transfer.dto';

export class UpdateStudentTransferDto extends PartialType(
  CreateStudentTransferDto,
) {
  @IsOptional()
  @IsUUID()
  approvedBy?: string;

  @IsOptional()
  @IsDateString()
  approvalDate?: string;
}
