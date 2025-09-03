import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTeachingAssignmentDto {
  @IsNumber({}, { message: "L'ID du professeur doit être un nombre" })
  teacher_id: number;

  @IsNumber({}, { message: "L'ID de la classe-matière doit être un nombre" })
  class_subject_id: number;

  @Type(() => String)
  @IsDateString({}, { message: 'La date de début doit être une date valide' })
  start_date: string | Date;

  @IsOptional()
  @Type(() => String)
  @IsDateString({}, { message: 'La date de fin doit être une date valide' })
  end_date?: string | Date;
}

export class UpdateTeachingAssignmentDto {
  @IsOptional()
  @IsNumber({}, { message: "L'ID du professeur doit être un nombre" })
  teacher_id?: number;

  @IsOptional()
  @IsNumber({}, { message: "L'ID de la classe-matière doit être un nombre" })
  class_subject_id?: number;

  @IsOptional()
  @Type(() => String)
  @IsDateString({}, { message: 'La date de début doit être une date valide' })
  start_date?: string | Date;

  @IsOptional()
  @Type(() => String)
  @IsDateString({}, { message: 'La date de fin doit être une date valide' })
  end_date?: string | Date;
}
