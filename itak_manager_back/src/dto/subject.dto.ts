import { IsString, IsOptional, MinLength, IsNumber } from 'class-validator';

export class CreateSubjectDto {
  @IsString({ message: 'Le nom de la matière doit être une chaîne' })
  @MinLength(2, {
    message: 'Le nom de la matière doit contenir au moins 2 caractères',
  })
  name: string;

  @IsString({ message: 'Le code doit être une chaîne' })
  @MinLength(2, { message: 'Le code doit contenir au moins 2 caractères' })
  code: string;

  @IsNumber({}, { message: "L'ID de la catégorie doit être un nombre" })
  categorie_id: number;
}

export class UpdateSubjectDto {
  @IsOptional()
  @IsString({ message: 'Le nom de la matière doit être une chaîne' })
  @MinLength(2, {
    message: 'Le nom de la matière doit contenir au moins 2 caractères',
  })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Le code doit être une chaîne' })
  @MinLength(2, { message: 'Le code doit contenir au moins 2 caractères' })
  code?: string;

  @IsOptional()
  @IsNumber({}, { message: "L'ID de la catégorie doit être un nombre" })
  categorie_id?: number;
}
