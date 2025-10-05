import { PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsUUID,
  IsDateString,
  IsArray,
  MinLength,
} from 'class-validator';
import { UserResponseDto } from '../../user/dto/user.dto';
import { Subject } from '../../../entities/subject.entity';

export class CreateTeacherDto {
  @IsUUID('4', { message: 'userId doit être un UUID valide' })
  userId: string;

  @IsString({ message: 'Le matricule doit être une chaîne' })
  @MinLength(3, { message: 'Le matricule doit contenir au moins 3 caractères' })
  matricule: string;

  @IsString({
    message: "La date d'embauche doit être une chaîne au format YYYY-MM-DD",
  })
  @IsDateString(
    {},
    { message: "La date d'embauche doit être au format YYYY-MM-DD" },
  )
  hireDate: string;

  @IsOptional()
  @IsString({ message: 'La photo doit être une chaîne' })
  photo?: string;

  @IsOptional()
  @IsString({ message: 'Le statut marital doit être une chaîne' })
  maritalStatus?: string;

  @IsOptional()
  @IsArray({ message: 'Les matières doivent être un tableau' })
  @IsUUID('4', {
    each: true,
    message: 'Chaque matière doit être un UUID valide',
  })
  subjectIds?: string[];

  @IsOptional()
  @IsString({ message: 'Les diplômes doivent être une chaîne' })
  diplomas?: string;

  @IsOptional()
  @IsString({ message: "L'adresse doit être une chaîne" })
  address?: string;

  @IsOptional()
  @IsString({ message: "Le contact d'urgence doit être une chaîne" })
  emergencyContact?: string;

  @IsOptional()
  @IsString({ message: 'Les notes doivent être une chaîne' })
  notes?: string;
}

export class UpdateTeacherDto extends PartialType(CreateTeacherDto) {}

export class TeacherResponseDto {
  id: string;
  matricule: string;
  hireDate: Date;
  photo?: string;
  maritalStatus?: string;
  subjects: Subject[];
  diplomas?: string;
  address?: string;
  emergencyContact?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  user?: UserResponseDto;
}
