import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  MinLength,
} from 'class-validator';

export class CreateStudentDto {
  @IsNumber({}, { message: 'user_id doit être un nombre' })
  user_id: number;

  @IsString({ message: 'Le matricule doit être une chaîne' })
  @MinLength(3, { message: 'Le matricule doit contenir au moins 3 caractères' })
  matricule: string;

  @IsString({
    message: "La date d'inscription doit être une chaîne au format YYYY-MM-DD",
  })
  @IsDateString(
    {},
    { message: "La date d'inscription doit être au format YYYY-MM-DD" },
  )
  enrollment_date: string;

  @IsOptional()
  @IsString({ message: 'La photo doit être une chaîne' })
  photo?: string;

  @IsOptional()
  @IsString({ message: 'Le statut marital doit être une chaîne' })
  marital_status?: string;

  @IsOptional()
  @IsString({ message: 'Le nom du père doit être une chaîne' })
  father_name?: string;

  @IsOptional()
  @IsString({ message: 'Le nom de la mère doit être une chaîne' })
  mother_name?: string;

  @IsOptional()
  @IsString({ message: 'Le nom du tuteur doit être une chaîne' })
  tutor_name?: string;

  @IsOptional()
  @IsString({ message: 'Le téléphone du tuteur doit être une chaîne' })
  tutor_phone?: string;

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

export class UpdateStudentDto {
  @IsOptional()
  @IsString({ message: 'Le matricule doit être une chaîne' })
  @MinLength(3, { message: 'Le matricule doit contenir au moins 3 caractères' })
  matricule?: string;

  @IsOptional()
  @IsString({
    message: "La date d'inscription doit être une chaîne au format YYYY-MM-DD",
  })
  @IsDateString(
    {},
    { message: "La date d'inscription doit être au format YYYY-MM-DD" },
  )
  enrollment_date?: string;

  @IsOptional()
  @IsString({ message: 'La photo doit être une chaîne' })
  photo?: string;

  @IsOptional()
  @IsString({ message: 'Le statut marital doit être une chaîne' })
  marital_status?: string;

  @IsOptional()
  @IsString({ message: 'Le nom du père doit être une chaîne' })
  father_name?: string;

  @IsOptional()
  @IsString({ message: 'Le nom de la mère doit être une chaîne' })
  mother_name?: string;

  @IsOptional()
  @IsString({ message: 'Le nom du tuteur doit être une chaîne' })
  tutor_name?: string;

  @IsOptional()
  @IsString({ message: 'Le téléphone du tuteur doit être une chaîne' })
  tutor_phone?: string;

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
