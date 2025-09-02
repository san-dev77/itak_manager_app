import {
  IsEmail,
  IsString,
  IsOptional,
  IsEnum,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: "Le nom d'utilisateur doit être une chaîne" })
  @MinLength(3, {
    message: "Le nom d'utilisateur doit contenir au moins 3 caractères",
  })
  username: string;

  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @IsString({ message: 'Le mot de passe doit être une chaîne' })
  @MinLength(6, {
    message: 'Le mot de passe doit contenir au moins 6 caractères',
  })
  password: string;

  @IsEnum(['student', 'teacher', 'staff', 'parent', 'admin'], {
    message: 'Rôle invalide',
  })
  role: 'student' | 'teacher' | 'staff' | 'parent' | 'admin';

  @IsString({ message: 'Le prénom doit être une chaîne' })
  first_name: string;

  @IsString({ message: 'Le nom doit être une chaîne' })
  last_name: string;

  @IsOptional()
  @IsString({ message: 'Le genre doit être une chaîne' })
  gender?: string;

  @IsOptional()
  @IsString({
    message: 'La date de naissance doit être une chaîne au format YYYY-MM-DD',
  })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message:
      'La date de naissance doit être au format YYYY-MM-DD (ex: 2009-02-04)',
  })
  birth_date?: string;

  @IsOptional()
  @IsString({ message: 'Le téléphone doit être une chaîne' })
  phone?: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: "Le nom d'utilisateur doit être une chaîne" })
  username?: string;

  @IsOptional()
  @IsString({ message: 'Le prénom doit être une chaîne' })
  first_name?: string;

  @IsOptional()
  @IsString({ message: 'Le nom doit être une chaîne' })
  last_name?: string;

  @IsOptional()
  @IsEnum(['student', 'teacher', 'staff', 'parent', 'admin'], {
    message: 'Rôle invalide',
  })
  role?: 'student' | 'teacher' | 'staff' | 'parent' | 'admin';

  @IsOptional()
  @IsString({ message: 'Le genre doit être une chaîne' })
  gender?: string;

  @IsOptional()
  @IsString({
    message: 'La date de naissance doit être une chaîne au format YYYY-MM-DD',
  })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message:
      'La date de naissance doit être au format YYYY-MM-DD (ex: 2009-02-04)',
  })
  birth_date?: string;

  @IsOptional()
  @IsString({ message: 'Le téléphone doit être une chaîne' })
  phone?: string;
}
