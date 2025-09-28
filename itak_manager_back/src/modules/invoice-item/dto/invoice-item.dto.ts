import { PartialType } from '@nestjs/swagger';
import { IsString, IsNumber, IsUUID, Min, MaxLength } from 'class-validator';
import { InvoiceResponseDto } from '../../invoice/dto/invoice.dto';
import { StudentFeeResponseDto } from '../../student-fee/dto/student-fee.dto';

export class CreateInvoiceItemDto {
  @IsUUID('4', { message: 'invoiceId doit être un UUID valide' })
  invoiceId: string;

  @IsUUID('4', { message: 'studentFeeId doit être un UUID valide' })
  studentFeeId: string;

  @IsString({ message: 'La description doit être une chaîne' })
  @MaxLength(255, {
    message: 'La description ne peut pas dépasser 255 caractères',
  })
  description: string;

  @IsNumber({}, { message: 'Le montant doit être un nombre' })
  @Min(0, { message: 'Le montant doit être positif' })
  amount: number;
}

export class UpdateInvoiceItemDto extends PartialType(CreateInvoiceItemDto) {}

export class InvoiceItemResponseDto {
  id: string;
  invoiceId: string;
  studentFeeId: string;
  description: string;
  amount: number;
  invoice?: InvoiceResponseDto;
  studentFee?: StudentFeeResponseDto;
}
