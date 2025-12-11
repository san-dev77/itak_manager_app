import {
  IsString,
  IsUUID,
  IsEnum,
  IsOptional,
  IsDateString,
  IsNumber,
  Min,
  Max,
  Length,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export enum AssessmentType {
  EXAM = 'exam', // Examens finaux
  HOMEWORK = 'homework', // Devoirs à la maison
  SUPERVISED_HOMEWORK = 'supervised_homework', // Devoirs surveillés (DS)
  TEST = 'test', // Tests courts
  QUIZ = 'quiz', // Quiz rapides
  MONTHLY_COMPOSITION = 'monthly_composition', // Compositions mensuelles
  CONTINUOUS_ASSESSMENT = 'continuous_assessment', // Contrôle continu
}

export class CreateAssessmentDto {
  @ApiProperty({ description: 'ID du trimestre' })
  @IsUUID()
  termId: string;

  @ApiProperty({ description: 'ID de la matière de classe' })
  @IsUUID()
  classSubjectId: string;

  @ApiProperty({
    description: "Type d'évaluation",
    enum: AssessmentType,
    default: AssessmentType.EXAM,
  })
  @IsEnum(AssessmentType)
  @IsOptional()
  type?: AssessmentType = AssessmentType.EXAM;

  @ApiProperty({ description: "Titre de l'évaluation", maxLength: 100 })
  @IsString()
  @Length(1, 100)
  title: string;

  @ApiPropertyOptional({ description: "Description de l'évaluation" })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: "Date de début de l'évaluation (YYYY-MM-DD)" })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: "Date de fin de l'évaluation (YYYY-MM-DD)" })
  @IsDateString()
  endDate: string;

  @ApiProperty({ description: 'Note maximale', default: 20, minimum: 0.01 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @IsOptional()
  maxScore?: number = 20;

  @ApiProperty({
    description: "Coefficient de l'évaluation",
    default: 1,
    minimum: 0.01,
    maximum: 10,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(10)
  @IsOptional()
  weight?: number = 1;
}

export class UpdateAssessmentDto extends PartialType(CreateAssessmentDto) {}

export class AssessmentResponseDto {
  @ApiProperty({ description: "ID de l'évaluation" })
  id: string;

  @ApiProperty({ description: 'ID du trimestre' })
  termId: string;

  @ApiProperty({ description: 'Nom du trimestre' })
  termName: string;

  @ApiProperty({ description: 'ID de la matière de classe' })
  classSubjectId: string;

  @ApiProperty({ description: 'Nom de la classe' })
  className: string;

  @ApiProperty({ description: 'Nom de la matière' })
  subjectName: string;

  @ApiProperty({
    description: "Type d'évaluation",
    enum: AssessmentType,
  })
  type: AssessmentType;

  @ApiProperty({ description: "Titre de l'évaluation" })
  title: string;

  @ApiProperty({ description: "Description de l'évaluation" })
  description: string;

  @ApiProperty({ description: "Date de début de l'évaluation" })
  startDate: Date;

  @ApiProperty({ description: "Date de fin de l'évaluation" })
  endDate: Date;

  @ApiProperty({ description: 'Note maximale' })
  maxScore: number;

  @ApiProperty({ description: "Coefficient de l'évaluation" })
  weight: number;

  @ApiProperty({ description: 'Date de création' })
  createdAt: Date;

  @ApiProperty({ description: 'Date de mise à jour' })
  updatedAt: Date;
}
