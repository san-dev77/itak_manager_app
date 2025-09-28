import { PartialType } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateSubjectDto {
  @IsString({ message: 'Le nom de la matière doit être une chaîne' })
  @MinLength(2, {
    message: 'Le nom de la matière doit contenir au moins 2 caractères',
  })
  name: string;

  @IsString({ message: 'Le code doit être une chaîne' })
  @MinLength(2, { message: 'Le code doit contenir au moins 2 caractères' })
  code: string;
}

export class UpdateSubjectDto extends PartialType(CreateSubjectDto) {}

export class SubjectResponseDto {
  id: string;
  name: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
}
