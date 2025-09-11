import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: "Adresse email de l'utilisateur",
    example: 'user@itak.com',
  })
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @ApiProperty({
    description: "Mot de passe de l'utilisateur",
    example: 'motdepasse123',
    minLength: 6,
  })
  @IsString({ message: 'Le mot de passe doit être une chaîne' })
  @MinLength(6, {
    message: 'Le mot de passe doit contenir au moins 6 caractères',
  })
  password: string;
}
