import { PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsUUID,
  IsDateString,
  MinLength,
} from 'class-validator';
import { UserResponseDto } from '../../user/dto/user.dto';

export class CreateStudentDto {
  @IsUUID('4', { message: 'userId doit être un UUID valide' })
  userId: string;

  @IsString({ message: 'Le matricule doit être une chaîne' })
  @MinLength(3, { message: 'Le matricule doit contenir au moins 3 caractères' })
  matricule: string;

  @IsDateString(
    {},
    { message: "La date d'inscription doit être au format YYYY-MM-DD" },
  )
  enrollmentDate: string;

  @IsOptional()
  @IsString({ message: 'La photo doit être une chaîne' })
  photo?: string;

  @IsOptional()
  @IsString({ message: 'Le statut marital doit être une chaîne' })
  maritalStatus?: string;

  @IsOptional()
  @IsString({ message: 'Le nom du père doit être une chaîne' })
  fatherName?: string;

  @IsOptional()
  @IsString({ message: 'Le nom de la mère doit être une chaîne' })
  motherName?: string;

  @IsOptional()
  @IsString({ message: 'Le nom du tuteur doit être une chaîne' })
  tutorName?: string;

  @IsOptional()
  @IsString({ message: 'Le téléphone du tuteur doit être une chaîne' })
  tutorPhone?: string;

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

export class UpdateStudentDto extends PartialType(CreateStudentDto) {}

export class StudentResponseDto {
  id: string;
  userId: string;
  matricule: string;
  enrollmentDate: string | Date;
  photo?: string;
  maritalStatus?: string;
  fatherName?: string;
  motherName?: string;
  tutorName?: string;
  tutorPhone?: string;
  address?: string;
  emergencyContact?: string;
  notes?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  user?: UserResponseDto;
}
