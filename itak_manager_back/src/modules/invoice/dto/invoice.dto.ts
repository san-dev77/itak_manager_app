import { PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsUUID,
  IsDateString,
  Min,
  MaxLength,
} from 'class-validator';
import { InvoiceStatus } from '../../../entities/invoice.entity';
import { StudentResponseDto } from '../../student/dto/student.dto';

export class CreateInvoiceDto {
  @IsUUID('4', { message: 'studentId doit être un UUID valide' })
  studentId: string;

  @IsString({ message: 'Le numéro de facture doit être une chaîne' })
  @MaxLength(50, {
    message: 'Le numéro de facture ne peut pas dépasser 50 caractères',
  })
  invoiceNumber: string;

  @IsNumber({}, { message: 'Le montant total doit être un nombre' })
  @Min(0, { message: 'Le montant total doit être positif' })
  totalAmount: number;

  @IsOptional()
  @IsEnum(InvoiceStatus, { message: 'Le statut doit être valide' })
  status?: InvoiceStatus;

  @IsDateString({}, { message: "La date d'émission doit être valide" })
  issuedDate: string;

  @IsOptional()
  @IsDateString({}, { message: "La date d'échéance doit être valide" })
  dueDate?: string;
}

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {}

export class InvoiceResponseDto {
  id: string;
  studentId: string;
  invoiceNumber: string;
  totalAmount: number;
  status: InvoiceStatus;
  issuedDate: string | Date;
  dueDate?: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
  student?: StudentResponseDto;
  items?: any[]; // InvoiceItemResponseDto[]
}
