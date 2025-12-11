import { PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MinLength,
  IsUUID,
  IsInt,
  Min,
} from 'class-validator';
import { ClassCategoryResponseDto } from '../../class-category/dto/class-category.dto';
import { ClassSubjectResponseDto } from '../../class-subject/dto/class-subject.dto';
import { StudentClassResponseDto } from '../../student-class/dto/student-class.dto';

export class CreateClassDto {
  @IsString({ message: 'Le nom de la classe doit être une chaîne' })
  @MinLength(1, {
    message: 'Le nom de la classe doit contenir au moins 1 caractères',
  })
  name: string;

  @IsString({ message: 'Le code de la classe doit être une chaîne' })
  @MinLength(1, {
    message: 'Le code de la classe doit contenir au moins 1 caractères',
  })
  code: string;

  @IsUUID('4', { message: 'La catégorie de la classe doit être une chaîne' })
  classCategoryId: string;

  @IsOptional()
  @IsString({ message: 'La description doit être une chaîne' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'Le niveau doit être une chaîne' })
  level?: string;

  @IsOptional()
  @IsInt({ message: 'La capacité doit être un nombre entier' })
  @Min(1, { message: 'La capacité doit être supérieure à 0' })
  capacity?: number;

  @IsInt({ message: 'Le niveau hiérarchique doit être un nombre entier' })
  @Min(1, { message: 'Le niveau hiérarchique doit être supérieur à 0' })
  orderLevel: number;
}

export class UpdateClassDto extends PartialType(CreateClassDto) {}

export class ClassResponseDto {
  id: string;
  name: string;
  code: string;
  classCategory: ClassCategoryResponseDto | null;
  description: string;
  level?: string;
  capacity?: number;
  orderLevel: number;
  createdAt: Date;
  updatedAt: Date;
  classSubjects: ClassSubjectResponseDto[];
  studentClasses: StudentClassResponseDto[];
}
