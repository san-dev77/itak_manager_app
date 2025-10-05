import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../entities/user.entity';

export class RegisterDto {
  @ApiProperty({
    description: "Nom d'utilisateur unique",
    example: 'johndoe',
    minLength: 3,
  })
  @IsString({ message: "Le nom d'utilisateur doit être une chaîne" })
  @MinLength(3, {
    message: "Le nom d'utilisateur doit contenir au moins 3 caractères",
  })
  username: string;

  @ApiProperty({
    description: 'Adresse email unique',
    example: 'john.doe@itak.com',
  })
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @ApiProperty({
    description: 'Mot de passe sécurisé',
    example: 'motdepasse123',
    minLength: 6,
  })
  @IsString({ message: 'Le mot de passe doit être une chaîne' })
  @MinLength(6, {
    message: 'Le mot de passe doit contenir au moins 6 caractères',
  })
  password: string;

  @ApiProperty({
    description: "Prénom de l'utilisateur",
    example: 'John',
  })
  @IsString({ message: 'Le prénom doit être une chaîne' })
  firstName: string;

  @ApiProperty({
    description: "Nom de famille de l'utilisateur",
    example: 'Doe',
  })
  @IsString({ message: 'Le nom doit être une chaîne' })
  lastName: string;

  @ApiProperty({
    description: "Rôle de l'utilisateur dans le système",
    example: UserRole.STUDENT,
    enum: UserRole,
  })
  @IsEnum(UserRole, { message: 'Le rôle doit être valide' })
  role: UserRole;

  @ApiProperty({
    description: `Genre de l'utilisateur`,
    example: 'Masculin',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Le genre doit être une chaîne' })
  gender?: string;

  @ApiProperty({
    description: `Date de naissance de l'utilisateur`,
    example: '1990-01-01',
    required: false,
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'La date de naissance doit être une date valide' },
  )
  birthDate?: string;

  @ApiProperty({
    description: 'Numéro de téléphone (optionnel)',
    example: '+221 77 123 45 67',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Le téléphone doit être une chaîne' })
  phone?: string;
}
