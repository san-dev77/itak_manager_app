import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  MinLength,
} from 'class-validator';

export class CreateStaffDto {
  @IsNumber({}, { message: 'user_id doit être un nombre' })
  user_id: number;

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
  hire_date: string;

  @IsString({ message: 'Le poste doit être une chaîne' })
  @MinLength(2, { message: 'Le poste doit contenir au moins 2 caractères' })
  position: string;

  @IsOptional()
  @IsString({ message: 'La photo doit être une chaîne' })
  photo?: string;

  @IsOptional()
  @IsString({ message: 'Le statut marital doit être une chaîne' })
  marital_status?: string;

  @IsOptional()
  @IsString({ message: "L'adresse doit être une chaîne" })
  address?: string;

  @IsOptional()
  @IsString({ message: "Le contact d'urgence doit être une chaîne" })
  emergency_contact?: string;

  @IsOptional()
  @IsString({ message: 'Les notes doivent être une chaîne' })
  notes?: string;
}

export class UpdateStaffDto {
  @IsOptional()
  @IsString({ message: 'Le matricule doit être une chaîne' })
  @MinLength(3, { message: 'Le matricule doit contenir au moins 3 caractères' })
  matricule?: string;

  @IsOptional()
  @IsString({
    message: "La date d'embauche doit être une chaîne au format YYYY-MM-DD",
  })
  @IsDateString(
    {},
    { message: "La date d'embauche doit être au format YYYY-MM-DD" },
  )
  hire_date?: string;

  @IsOptional()
  @IsString({ message: 'Le poste doit être une chaîne' })
  @MinLength(2, { message: 'Le poste doit contenir au moins 2 caractères' })
  position?: string;

  @IsOptional()
  @IsString({ message: 'La photo doit être une chaîne' })
  photo?: string;

  @IsOptional()
  @IsString({ message: 'Le statut marital doit être une chaîne' })
  marital_status?: string;

  @IsOptional()
  @IsString({ message: "L'adresse doit être une chaîne" })
  address?: string;

  @IsOptional()
  @IsString({ message: "Le contact d'urgence doit être une chaîne" })
  emergency_contact?: string;

  @IsOptional()
  @IsString({ message: 'Les notes doivent être une chaîne' })
  notes?: string;
}
