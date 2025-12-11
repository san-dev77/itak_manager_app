import { IsUUID, IsString, IsOptional } from 'class-validator';
import { StudentResponseDto } from '../../student/dto/student.dto';
import { ClassResponseDto } from '../../class/dto/class.dto';

export class CreatePromotionDto {
  @IsUUID('4', { message: "L'ID de l'étudiant doit être un UUID valide" })
  studentId: string;

  @IsUUID('4', {
    message: "L'ID de la classe de destination doit être un UUID valide",
  })
  toClassId: string;

  @IsString({ message: "L'année scolaire doit être une chaîne" })
  year: string;

  @IsOptional()
  @IsString({ message: 'Les remarques doivent être une chaîne' })
  remarks?: string;
}

export class BulkPromotionDto {
  @IsUUID('4', { message: "L'ID de la classe source doit être un UUID valide" })
  fromClassId: string;

  @IsUUID('4', {
    message: "L'ID de la classe de destination doit être un UUID valide",
  })
  toClassId: string;

  @IsString({ message: "L'année scolaire doit être une chaîne" })
  year: string;

  @IsOptional()
  @IsString({ message: 'Les remarques doivent être une chaîne' })
  remarks?: string;
}

export class PromotionResponseDto {
  student: StudentResponseDto;
  fromClass: ClassResponseDto;
  toClass: ClassResponseDto;
  year: string;
  remarks?: string;
  createdAt: Date;
}

export class NextClassResponseDto {
  currentClass: ClassResponseDto;
  nextClass: ClassResponseDto | null;
  canPromote: boolean;
  message: string;
}
