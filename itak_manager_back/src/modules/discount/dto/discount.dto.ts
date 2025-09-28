import { PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsUUID,
  Min,
} from 'class-validator';
import { DiscountType } from '../../../entities/discount.entity';
import { StudentFeeResponseDto } from '../../student-fee/dto/student-fee.dto';
import { UserResponseDto } from '../../user/dto/user.dto';

export class CreateDiscountDto {
  @IsUUID('4', { message: 'studentFeeId doit être un UUID valide' })
  studentFeeId: string;

  @IsEnum(DiscountType, { message: 'Le type de réduction doit être valide' })
  type: DiscountType;

  @IsOptional()
  @IsString({ message: 'La description doit être une chaîne' })
  description?: string;

  @IsNumber({}, { message: 'Le montant doit être un nombre' })
  @Min(0.01, { message: 'Le montant doit être supérieur à 0' })
  amount: number;

  @IsUUID('4', { message: 'approvedBy doit être un UUID valide' })
  approvedBy: string;
}

export class UpdateDiscountDto extends PartialType(CreateDiscountDto) {}

export class DiscountResponseDto {
  id: string;
  studentFeeId: string;
  type: DiscountType;
  description?: string;
  amount: number;
  approvedBy: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  studentFee?: StudentFeeResponseDto;
  approvedByUser?: UserResponseDto;
}
