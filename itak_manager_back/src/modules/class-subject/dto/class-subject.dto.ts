import { PartialType } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsBoolean,
  Min,
  Max,
  IsNumber,
} from 'class-validator';

export class CreateClassSubjectDto {
  @IsString({ message: "L'ID de la classe doit être une chaîne de caractères" })
  classId: string;

  @IsString({
    message: "L'ID de la matière doit être une chaîne de caractères",
  })
  subjectId: string;

  @IsNumber({}, { message: 'Le coefficient doit être un nombre' })
  @Min(0, { message: 'Le coefficient doit être au moins 0' })
  @Max(10, { message: 'Le coefficient ne peut pas dépasser 10' })
  coefficient: number;

  @IsOptional()
  @IsNumber({}, { message: 'Les heures hebdomadaires doivent être un nombre' })
  @Min(0, { message: 'Les heures hebdomadaires doivent être au moins 0' })
  @Max(40, { message: 'Les heures hebdomadaires ne peuvent pas dépasser 40' })
  weeklyHours?: number;

  @IsOptional()
  @IsBoolean({ message: 'Le statut optionnel doit être un booléen' })
  isOptional?: boolean;
}

export class UpdateClassSubjectDto extends PartialType(CreateClassSubjectDto) {}

export class ClassSubjectResponseDto {
  id: string;
  classId: string;
  subjectId: string;
  coefficient: number;
  weeklyHours: number;
  isOptional: boolean;
  createdAt: Date;
  updatedAt: Date;
  class?: {
    id: string;
    name: string;
    code: string;
    description: string;
  };
  subject?: {
    id: string;
    name: string;
    code: string;
  };
}
