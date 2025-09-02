import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @IsString({ message: 'Le mot de passe doit être une chaîne' })
  @MinLength(6, {
    message: 'Le mot de passe doit contenir au moins 6 caractères',
  })
  password: string;
}

export class RegisterDto {
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

  @IsString({ message: 'Le prénom doit être une chaîne' })
  first_name: string;

  @IsString({ message: 'Le nom doit être une chaîne' })
  last_name: string;

  @IsString({ message: 'Le rôle doit être une chaîne' })
  role: 'student' | 'teacher' | 'staff' | 'parent' | 'admin';
}
