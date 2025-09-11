import { PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsOptional,
  IsBoolean,
  IsUUID,
  IsInt,
  Min,
  MinLength,
} from 'class-validator';
import { SchoolYearResponseDto } from '../../school-year/dto/school-year.dto';

export class CreateTermDto {
  @IsUUID('4', { message: 'L\'ID de l\'année scolaire doit être un UUID valide' })
  schoolYearId: string;

  @IsString({ message: 'Le nom du trimestre doit être une chaîne' })
  @MinLength(1, {
    message: 'Le nom du trimestre doit contenir au moins 1 caractère',
  })
  name: string;

  @IsDateString({}, { message: 'La date de début doit être une date valide' })
  startDate: string;

  @IsDateString({}, { message: 'La date de fin doit être une date valide' })
  endDate: string;

  @IsOptional()
  @IsBoolean({ message: 'isActive doit être un booléen' })
  isActive?: boolean;

  @IsOptional()
  @IsInt({ message: 'Le numéro d\'ordre doit être un nombre entier' })
  @Min(1, { message: 'Le numéro d\'ordre doit être supérieur à 0' })
  orderNumber?: number;
}

export class UpdateTermDto extends PartialType(CreateTermDto) {}

export class TermResponseDto {
  id: string;
  schoolYearId: string;
  name: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  orderNumber: number;
  createdAt: Date;
  updatedAt: Date;
  schoolYear?: SchoolYearResponseDto;
}
