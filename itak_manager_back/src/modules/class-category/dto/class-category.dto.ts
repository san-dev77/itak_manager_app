import { PartialType } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateClassCategoryDto {
  @IsString({ message: 'Le nom doit être une chaîne' })
  @MinLength(2, { message: 'Le nom doit contenir au moins 2 caractères' })
  name: string;
}

export class UpdateClassCategoryDto extends PartialType(
  CreateClassCategoryDto,
) {}

export class ClassCategoryResponseDto {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
