import { PartialType } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsUUID, Min } from 'class-validator';
import { PaymentResponseDto } from '../../payment/dto/payment.dto';
import { UserResponseDto } from '../../user/dto/user.dto';

export class CreateRefundDto {
  @IsUUID('4', { message: 'paymentId doit être un UUID valide' })
  paymentId: string;

  @IsNumber({}, { message: 'Le montant doit être un nombre' })
  @Min(0.01, { message: 'Le montant doit être supérieur à 0' })
  amount: number;

  @IsOptional()
  @IsString({ message: 'La raison doit être une chaîne' })
  reason?: string;

  @IsUUID('4', { message: 'processedBy doit être un UUID valide' })
  processedBy: string;
}

export class UpdateRefundDto extends PartialType(CreateRefundDto) {}

export class RefundResponseDto {
  id: string;
  paymentId: string;
  amount: number;
  reason?: string;
  processedBy: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  payment?: PaymentResponseDto;
  processedByUser?: UserResponseDto;
}

export class RefundSummaryDto {
  totalAmount: number;
  totalRefunds: number;
  refundsByMonth: {
    month: string;
    count: number;
    totalAmount: number;
  }[];
}
