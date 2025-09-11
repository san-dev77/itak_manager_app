import {
  IsEmail,
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { UserRole } from 'src/entities';

export class CreateUserDto {
  @IsOptional()
  @IsString({ message: "Le nom d'utilisateur doit être une chaîne" })
  username?: string;

  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @IsString({ message: 'Le prénom doit être une chaîne' })
  firstName: string;

  @IsString({ message: 'Le nom doit être une chaîne' })
  lastName: string;

  @IsOptional()
  @IsString({ message: 'Le genre doit être une chaîne' })
  gender?: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'La date de naissance doit être une date valide' },
  )
  birthDate?: string;

  @IsOptional()
  @IsString({ message: 'Le téléphone doit être une chaîne' })
  phone?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Rôle invalide' })
  role?: UserRole;

  @IsOptional()
  @IsBoolean({ message: 'isActive doit être un booléen' })
  isActive?: boolean;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: "Le nom d'utilisateur doit être une chaîne" })
  username?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email invalide' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Le prénom doit être une chaîne' })
  firstName?: string;

  @IsOptional()
  @IsString({ message: 'Le nom doit être une chaîne' })
  lastName?: string;

  @IsOptional()
  @IsString({ message: 'Le genre doit être une chaîne' })
  gender?: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'La date de naissance doit être une date valide' },
  )
  birthDate?: string;

  @IsOptional()
  @IsString({ message: 'Le téléphone doit être une chaîne' })
  phone?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Rôle invalide' })
  role?: UserRole;

  @IsOptional()
  @IsBoolean({ message: 'isActive doit être un booléen' })
  isActive?: boolean;
}

export class UserResponseDto {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender?: string;
  birthDate?: Date;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
