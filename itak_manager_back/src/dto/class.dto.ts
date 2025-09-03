import {
  IsString,
  IsOptional,
  IsNumber,
  MinLength,
  Min,
} from 'class-validator';

export class CreateClassDto {
  @IsString({ message: 'Le nom de la classe doit être une chaîne' })
  @MinLength(1, {
    message: 'Le nom de la classe doit contenir au moins 1 caractères',
  })
  name: string;

  @IsString({ message: 'Le niveau doit être une chaîne' })
  @MinLength(1, { message: 'Le niveau doit contenir au moins 1 caractères' })
  level: string;

  @IsOptional()
  @IsNumber({}, { message: 'La capacité doit être un nombre' })
  @Min(1, { message: 'La capacité doit être au moins 1' })
  capacity?: number;

  @IsNumber({}, { message: "L'ID de la catégorie doit être un nombre" })
  categorie_id: number;
}

export class UpdateClassDto {
  @IsOptional()
  @IsString({ message: 'Le nom de la classe doit être une chaîne' })
  @MinLength(2, {
    message: 'Le nom de la classe doit contenir au moins 2 caractères',
  })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Le niveau doit être une chaîne' })
  @MinLength(2, { message: 'Le niveau doit contenir au moins 2 caractères' })
  level?: string;

  @IsOptional()
  @IsNumber({}, { message: 'La capacité doit être un nombre' })
  @Min(1, { message: 'La capacité doit être au moins 1' })
  capacity?: number;

  @IsOptional()
  @IsNumber({}, { message: "L'ID de la catégorie doit être un nombre" })
  categorie_id?: number;
}
