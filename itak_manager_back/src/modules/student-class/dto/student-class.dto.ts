import { IsOptional, IsDateString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/swagger';
import { StudentResponseDto } from 'src/modules/student/dto/student.dto';
import { ClassResponseDto } from 'src/modules/class/dto/class.dto';

export class CreateStudentClassDto {
  @IsUUID('4', { message: "L'ID de l'étudiant doit être un UUID" })
  studentId: string;

  @IsUUID('4', { message: "L'ID de la classe doit être un UUID" })
  classId: string;

  @Type(() => String)
  @IsDateString({}, { message: 'La date de début doit être une date valide' })
  startDate: string | Date;

  @IsOptional()
  @Type(() => String)
  @IsDateString({}, { message: 'La date de fin doit être une date valide' })
  endDate?: string | Date;
}

export class UpdateStudentClassDto extends PartialType(CreateStudentClassDto) {}

export class StudentClassResponseDto {
  id: string;
  studentId: string;
  classId: string;
  startDate: string | Date;
  endDate: string | Date;
  createdAt: Date;
  updatedAt: Date;
  student?: StudentResponseDto;
  class?: ClassResponseDto;
}
