import {
  IsString,
  IsUUID,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FileType } from '../../../entities/assessment-subject.entity';

export class CreateAssessmentSubjectDto {
  @ApiProperty({ description: "ID de l'évaluation" })
  @IsUUID()
  assessmentId: string;

  @ApiProperty({
    description: 'Type de fichier',
    enum: FileType,
  })
  @IsEnum(FileType)
  fileType: FileType;
}

export class UpdateAssessmentSubjectDto {
  @ApiPropertyOptional({
    description: 'Type de fichier',
    enum: FileType,
  })
  @IsEnum(FileType)
  @IsOptional()
  fileType?: FileType;
}

export class AssessmentSubjectResponseDto {
  @ApiProperty({ description: 'ID du sujet' })
  id: string;

  @ApiProperty({ description: "ID de l'évaluation" })
  assessmentId: string;

  @ApiProperty({ description: "Titre de l'évaluation" })
  assessmentTitle: string;

  @ApiProperty({ description: 'URL du fichier' })
  fileUrl: string;

  @ApiProperty({
    description: 'Type de fichier',
    enum: FileType,
  })
  fileType: FileType;

  @ApiProperty({ description: 'ID de l\'utilisateur qui a uploadé' })
  uploadedBy: string;

  @ApiProperty({ description: 'Nom de l\'utilisateur qui a uploadé' })
  uploadedByName: string;

  @ApiProperty({ description: 'Nom original du fichier' })
  originalFileName: string;

  @ApiProperty({ description: 'Taille du fichier en octets' })
  fileSize: number;

  @ApiProperty({ description: 'Date de création' })
  createdAt: Date;

  @ApiProperty({ description: 'Date de mise à jour' })
  updatedAt: Date;
}
