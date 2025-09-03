import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  Validate,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStudentClassDto {
  @IsNumber({}, { message: "L'ID de l'étudiant doit être un nombre" })
  student_id: number;

  @IsNumber({}, { message: "L'ID de la classe doit être un nombre" })
  class_id: number;

  @Type(() => String)
  @IsDateString({}, { message: 'La date de début doit être une date valide' })
  start_date: string | Date;

  @IsOptional()
  @Type(() => String)
  @IsDateString({}, { message: 'La date de fin doit être une date valide' })
  end_date?: string | Date;
}

export class UpdateStudentClassDto {
  @IsOptional()
  @IsNumber({}, { message: "L'ID de l'étudiant doit être un nombre" })
  student_id?: number;

  @IsOptional()
  @IsNumber({}, { message: "L'ID de la classe doit être un nombre" })
  class_id?: number;

  @IsOptional()
  @Type(() => String)
  @IsDateString({}, { message: 'La date de début doit être une date valide' })
  start_date?: string | Date;

  @IsOptional()
  @Type(() => String)
  @IsDateString({}, { message: 'La date de fin doit être une date valide' })
  end_date?: string | Date;
}
