import { PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsOptional,
  IsBoolean,
  MinLength,
} from 'class-validator';
import { TermResponseDto } from '../../term/dto/term.dto';

export class CreateSchoolYearDto {
  @IsString({ message: "Le nom de l'année scolaire doit être une chaîne" })
  @MinLength(1, {
    message: "Le nom de l'année scolaire doit contenir au moins 1 caractère",
  })
  name: string;

  @IsDateString({}, { message: 'La date de début doit être une date valide' })
  startDate: string;

  @IsDateString({}, { message: 'La date de fin doit être une date valide' })
  endDate: string;

  @IsOptional()
  @IsBoolean({ message: 'isActive doit être un booléen' })
  isActive?: boolean;
}

export class UpdateSchoolYearDto extends PartialType(CreateSchoolYearDto) {}

export class SchoolYearResponseDto {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  terms?: TermResponseDto[];
}
