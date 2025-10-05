import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../entities/user.entity';

export class UserResponseDto {
  @ApiProperty({ description: "ID unique de l'utilisateur" })
  id: string;

  @ApiProperty({ description: 'Adresse email' })
  email: string;

  @ApiProperty({ description: 'Prénom' })
  firstName: string;

  @ApiProperty({ description: 'Nom de famille' })
  lastName: string;

  @ApiProperty({ description: 'Numéro de téléphone', required: false })
  phone?: string;

  @ApiProperty({ description: "Rôle de l'utilisateur", enum: UserRole })
  role: UserRole;

  @ApiProperty({ description: 'Statut actif' })
  isActive: boolean;

  @ApiProperty({ description: 'Date de création' })
  createdAt: Date;

  @ApiProperty({ description: 'Date de mise à jour' })
  updatedAt: Date;
}
