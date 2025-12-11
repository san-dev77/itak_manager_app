import { PartialType } from '@nestjs/swagger';
import { IsString, MinLength, IsOptional, IsUUID } from 'class-validator';

export class CreateClassCategoryDto {
  @IsString({ message: 'Le nom doit être une chaîne' })
  @MinLength(2, { message: 'Le nom doit contenir au moins 2 caractères' })
  name: string;

  @IsOptional()
  @IsUUID('4', { message: 'institutionId doit être un UUID valide' })
  institutionId?: string;
}

export class UpdateClassCategoryDto extends PartialType(
  CreateClassCategoryDto,
) {}

export class InstitutionResponseDto {
  id: string;
  name: string;
  code: string;
  description?: string;
}

export class ClassCategoryResponseDto {
  id: string;
  name: string;
  institutionId?: string;
  institution?: InstitutionResponseDto;
  createdAt: Date;
  updatedAt: Date;
}
