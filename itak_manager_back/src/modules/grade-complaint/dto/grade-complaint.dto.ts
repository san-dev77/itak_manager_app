import {
  IsString,
  IsUUID,
  IsEnum,
  IsOptional,
  IsNumber,
  Min,
  Length,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ComplaintStatus } from '../../../entities/grade-complaint.entity';

export class CreateGradeComplaintDto {
  @ApiProperty({ description: "ID de l'étudiant" })
  @IsUUID()
  studentId: string;

  @ApiProperty({ description: "ID de l'évaluation" })
  @IsUUID()
  assessmentId: string;

  @ApiProperty({ description: 'Motif de la réclamation', minLength: 10 })
  @IsString()
  @Length(10, 1000)
  reason: string;
}

export class UpdateGradeComplaintStatusDto {
  @ApiProperty({
    description: 'Nouveau statut de la réclamation',
    enum: ComplaintStatus,
  })
  @IsEnum(ComplaintStatus)
  status: ComplaintStatus;

  @ApiPropertyOptional({
    description: 'Commentaire sur le changement de statut',
  })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiPropertyOptional({
    description: 'Nouvelle note (si approuvée)',
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  newScore?: number;
}

export class GradeComplaintResponseDto {
  @ApiProperty({ description: 'ID de la réclamation' })
  id: string;

  @ApiProperty({ description: "ID de l'étudiant" })
  studentId: string;

  @ApiProperty({ description: "Nom complet de l'étudiant" })
  studentName: string;

  @ApiProperty({ description: "Matricule de l'étudiant" })
  studentMatricule: string;

  @ApiProperty({ description: "ID de l'évaluation" })
  assessmentId: string;

  @ApiProperty({ description: "Titre de l'évaluation" })
  assessmentTitle: string;

  @ApiProperty({ description: 'Note actuelle' })
  currentScore: number;

  @ApiProperty({ description: "Note maximale de l'évaluation" })
  maxScore: number;

  @ApiProperty({
    description: 'Statut de la réclamation',
    enum: ComplaintStatus,
  })
  status: ComplaintStatus;

  @ApiProperty({ description: 'Motif de la réclamation' })
  reason: string;

  @ApiProperty({ description: 'Date de création' })
  createdAt: Date;

  @ApiProperty({ description: 'Date de mise à jour' })
  updatedAt: Date;
}

export class GradeComplaintHistoryResponseDto {
  @ApiProperty({ description: "ID de l'historique" })
  id: string;

  @ApiProperty({ description: 'ID de la réclamation' })
  complaintId: string;

  @ApiProperty({ description: 'Ancienne note' })
  oldScore: number;

  @ApiProperty({ description: 'Nouvelle note' })
  newScore: number;

  @ApiProperty({
    description: "ID de l'utilisateur qui a effectué le changement",
  })
  changedBy: string;

  @ApiProperty({
    description: "Nom de l'utilisateur qui a effectué le changement",
  })
  changedByName: string;

  @ApiProperty({ description: 'Date du changement' })
  changedAt: Date;

  @ApiProperty({ description: 'Commentaire sur le changement' })
  comment: string;
}
