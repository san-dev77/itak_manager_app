import { PartialType } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, MinLength } from 'class-validator';
import { UserResponseDto } from '../../user/dto/user.dto';

export class CreateStaffDto {
  @IsString({ message: 'userId doit être une chaîne' })
  userId: string;

  @IsOptional()
  @IsString({ message: 'Le matricule doit être une chaîne' })
  @MinLength(3, { message: 'Le matricule doit contenir au moins 3 caractères' })
  matricule?: string;

  @IsString({
    message: "La date d'embauche doit être une chaîne au format YYYY-MM-DD",
  })
  @IsDateString(
    {},
    { message: "La date d'embauche doit être au format YYYY-MM-DD" },
  )
  hireDate: string;

  @IsString({ message: 'Le poste doit être une chaîne' })
  @MinLength(2, { message: 'Le poste doit contenir au moins 2 caractères' })
  position: string;

  @IsOptional()
  @IsString({ message: 'La photo doit être une chaîne' })
  photo?: string;

  @IsOptional()
  @IsString({ message: 'Le statut marital doit être une chaîne' })
  maritalStatus?: string;

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

export class UpdateStaffDto extends PartialType(CreateStaffDto) {}

export class StaffResponseDto {
  id: string;
  userId: string;
  matricule?: string;
  hireDate: string | Date;
  position: string;
  photo?: string;
  maritalStatus?: string;
  address?: string;
  emergencyContact?: string;
  notes?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  user?: UserResponseDto;
}
