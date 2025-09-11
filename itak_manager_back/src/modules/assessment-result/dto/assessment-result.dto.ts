import {
  IsString,
  IsUUID,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AssessmentResultStatus } from '../../../entities/assessment-result.entity';

export class CreateAssessmentResultDto {
  @ApiProperty({ description: "ID de l'évaluation" })
  @IsUUID()
  assessmentId: string;

  @ApiProperty({ description: "ID de l'étudiant" })
  @IsUUID()
  studentId: string;

  @ApiProperty({ description: 'Note obtenue', minimum: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  score: number;

  @ApiPropertyOptional({ description: 'Remarques sur la performance' })
  @IsString()
  @IsOptional()
  remarks?: string;

  @ApiPropertyOptional({
    description: "Statut de présence de l'étudiant",
    enum: AssessmentResultStatus,
    default: AssessmentResultStatus.PRESENT,
  })
  @IsEnum(AssessmentResultStatus)
  @IsOptional()
  status?: AssessmentResultStatus = AssessmentResultStatus.PRESENT;
}

export class UpdateAssessmentResultDto {
  @ApiPropertyOptional({ description: 'Note obtenue', minimum: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  score?: number;

  @ApiPropertyOptional({ description: 'Remarques sur la performance' })
  @IsString()
  @IsOptional()
  remarks?: string;

  @ApiPropertyOptional({
    description: "Statut de présence de l'étudiant",
    enum: AssessmentResultStatus,
  })
  @IsEnum(AssessmentResultStatus)
  @IsOptional()
  status?: AssessmentResultStatus;
}

export class AssessmentResultResponseDto {
  @ApiProperty({ description: 'ID du résultat' })
  id: string;

  @ApiProperty({ description: "ID de l'évaluation" })
  assessmentId: string;

  @ApiProperty({ description: "Titre de l'évaluation" })
  assessmentTitle: string;

  @ApiProperty({ description: "Note maximale de l'évaluation" })
  assessmentMaxScore: number;

  @ApiProperty({ description: "ID de l'étudiant" })
  studentId: string;

  @ApiProperty({ description: "Nom complet de l'étudiant" })
  studentName: string;

  @ApiProperty({ description: "Matricule de l'étudiant" })
  studentMatricule: string;

  @ApiProperty({ description: 'Note obtenue' })
  score: number;

  @ApiProperty({ description: 'Pourcentage obtenu' })
  percentage: number;

  @ApiProperty({ description: 'Remarques sur la performance' })
  remarks: string;

  @ApiProperty({
    description: "Statut de présence de l'étudiant",
    enum: AssessmentResultStatus,
  })
  status: AssessmentResultStatus;

  @ApiProperty({ description: 'Date de création' })
  createdAt: Date;

  @ApiProperty({ description: 'Date de mise à jour' })
  updatedAt: Date;
}

export class BulkCreateAssessmentResultDto {
  @ApiProperty({ description: "ID de l'évaluation" })
  @IsUUID()
  assessmentId: string;

  @ApiProperty({
    description: 'Liste des résultats à créer',
    type: [CreateAssessmentResultDto],
  })
  results: Omit<CreateAssessmentResultDto, 'assessmentId'>[];
}
