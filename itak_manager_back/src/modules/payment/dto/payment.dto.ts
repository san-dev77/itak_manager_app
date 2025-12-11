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
import { PaymentMethod, PaymentStatus } from '../../../entities/payment.entity';
import { StudentFeeResponseDto } from '../../student-fee/dto/student-fee.dto';
import { UserResponseDto } from '../../user/dto/user.dto';

export class CreatePaymentDto {
  @IsUUID('4', { message: 'studentFeeId doit être un UUID valide' })
  studentFeeId: string;

  @IsDateString({}, { message: 'La date de paiement doit être valide' })
  paymentDate: string;

  @IsNumber({}, { message: 'Le montant doit être un nombre' })
  @Min(0.01, { message: 'Le montant doit être supérieur à 0' })
  amount: number;

  @IsEnum(PaymentMethod, { message: 'La méthode de paiement doit être valide' })
  method: PaymentMethod;

  @IsOptional()
  @IsString({ message: 'Le fournisseur doit être une chaîne' })
  @MaxLength(50, {
    message: 'Le fournisseur ne peut pas dépasser 50 caractères',
  })
  provider?: string;

  @IsOptional()
  @IsString({ message: 'La référence de transaction doit être une chaîne' })
  @MaxLength(100, {
    message: 'La référence de transaction ne peut pas dépasser 100 caractères',
  })
  transactionRef?: string;

  @IsUUID('4', { message: 'receivedBy doit être un UUID valide' })
  receivedBy: string;

  @IsOptional()
  @IsEnum(PaymentStatus, { message: 'Le statut doit être valide' })
  status?: PaymentStatus;
}

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {}

export class PaymentResponseDto {
  id: string;
  studentFeeId: string;
  paymentDate: string | Date;
  amount: number;
  method: PaymentMethod;
  provider?: string;
  transactionRef?: string;
  receivedBy: string;
  status: PaymentStatus;
  createdAt: string | Date;
  updatedAt: string | Date;
  studentFee?: StudentFeeResponseDto;
  receivedByUser?: UserResponseDto;
}

export class PaymentSummaryDto {
  totalAmount: number;
  totalPayments: number;
  paymentsByMethod: {
    method: PaymentMethod;
    count: number;
    totalAmount: number;
  }[];
  paymentsByStatus: {
    status: PaymentStatus;
    count: number;
    totalAmount: number;
  }[];
}
