import { IsOptional, IsDateString, IsUUID } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { ClassResponseDto } from '../../class/dto/class.dto';
import { SubjectResponseDto } from '../../subject/dto/subject.dto';
import { ClassSubjectResponseDto } from '../../class-subject/dto/class-subject.dto';
import { TeacherResponseDto } from '../../teacher/dto/teacher.dto';

export class CreateTeachingAssignmentDto {
  @IsUUID('4', {
    message: "L'ID du professeur doit être un UUID valide",
  })
  teacherId: string;

  @IsUUID('4', {
    message: "L'ID de la classe-matière doit être un UUID valide",
  })
  classSubjectId: string;

  @IsDateString({}, { message: 'La date de début doit être une date valide' })
  startDate: string | Date;

  @IsOptional()
  @IsDateString({}, { message: 'La date de fin doit être une date valide' })
  endDate?: string | Date;
}

export class UpdateTeachingAssignmentDto extends PartialType(
  CreateTeachingAssignmentDto,
) {}

export class TeachingAssignmentResponseDto {
  id: string;
  startDate: Date;
  endDate?: Date;
  teacher?: TeacherResponseDto;
  classSubject?: ClassSubjectResponseDto;
  coefficient: number;
  class: ClassResponseDto;
  subject: SubjectResponseDto;
  createdAt: Date;
  updatedAt: Date;
}
