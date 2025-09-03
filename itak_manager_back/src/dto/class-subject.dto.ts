import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';

export class CreateClassSubjectDto {
  @IsNumber({}, { message: "L'ID de la classe doit être un nombre" })
  class_id: number;

  @IsNumber({}, { message: "L'ID de la matière doit être un nombre" })
  subject_id: number;

  @IsNumber({}, { message: 'Le coefficient doit être un nombre' })
  @Min(0, { message: 'Le coefficient doit être au moins 0' })
  @Max(10, { message: 'Le coefficient ne peut pas dépasser 10' })
  coefficient: number;

  @IsOptional()
  @IsNumber({}, { message: 'Les heures hebdomadaires doivent être un nombre' })
  @Min(0, { message: 'Les heures hebdomadaires doivent être au moins 0' })
  @Max(40, { message: 'Les heures hebdomadaires ne peuvent pas dépasser 40' })
  weekly_hours?: number;

  @IsOptional()
  @IsBoolean({ message: 'Le statut optionnel doit être un booléen' })
  is_optional?: boolean;
}

export class UpdateClassSubjectDto {
  @IsOptional()
  @IsNumber({}, { message: "L'ID de la classe doit être un nombre" })
  class_id?: number;

  @IsOptional()
  @IsNumber({}, { message: "L'ID de la matière doit être un nombre" })
  subject_id?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Le coefficient doit être un nombre' })
  @Min(0, { message: 'Le coefficient doit être au moins 0' })
  @Max(10, { message: 'Le coefficient ne peut pas dépasser 10' })
  coefficient?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Les heures hebdomadaires doivent être un nombre' })
  @Min(0, { message: 'Les heures hebdomadaires doivent être au moins 0' })
  @Max(40, { message: 'Les heures hebdomadaires ne peuvent pas dépasser 40' })
  weekly_hours?: number;

  @IsOptional()
  @IsBoolean({ message: 'Le statut optionnel doit être un booléen' })
  is_optional?: boolean;
}
