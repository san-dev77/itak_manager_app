import { PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
  Min,
  MinLength,
} from 'class-validator';
import { FeeFrequency } from '../../../entities/fee-type.entity';

export class CreateFeeTypeDto {
  @IsString({ message: 'Le nom doit être une chaîne' })
  @MinLength(2, { message: 'Le nom doit contenir au moins 2 caractères' })
  name: string;

  @IsOptional()
  @IsString({ message: 'La description doit être une chaîne' })
  description?: string;

  @IsNumber({}, { message: 'Le montant par défaut doit être un nombre' })
  @Min(0, { message: 'Le montant par défaut doit être positif' })
  amountDefault: number;

  @IsOptional()
  @IsBoolean({ message: 'isRecurring doit être un booléen' })
  isRecurring?: boolean;

  @IsOptional()
  @IsEnum(FeeFrequency, { message: 'La fréquence doit être une valeur valide' })
  frequency?: FeeFrequency;
}

export class UpdateFeeTypeDto extends PartialType(CreateFeeTypeDto) {}

export class FeeTypeResponseDto {
  id: string;
  name: string;
  description?: string;
  amountDefault: number;
  isRecurring: boolean;
  frequency?: FeeFrequency;
  createdAt: string | Date;
  updatedAt: string | Date;
}
