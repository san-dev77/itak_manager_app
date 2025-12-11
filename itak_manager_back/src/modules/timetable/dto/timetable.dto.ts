import { PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';
import { DayOfWeek } from '../../../entities/timetable.entity';

export class CreateTimetableDto {
  @IsUUID('4', { message: 'teachingAssignmentId doit être un UUID valide' })
  teachingAssignmentId: string;

  @IsUUID('4', { message: 'academicYearId doit être un UUID valide' })
  academicYearId: string;

  @IsEnum(DayOfWeek, { message: 'Le jour de la semaine doit être valide' })
  dayOfWeek: DayOfWeek;

  @IsString({ message: "L'heure de début doit être une chaîne" })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "L'heure de début doit être au format HH:MM",
  })
  startTime: string;

  @IsString({ message: "L'heure de fin doit être une chaîne" })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "L'heure de fin doit être au format HH:MM",
  })
  endTime: string;

  @IsOptional()
  @IsString({ message: 'La salle doit être une chaîne' })
  @MaxLength(50, { message: 'La salle ne peut pas dépasser 50 caractères' })
  room?: string;
}

export class UpdateTimetableDto extends PartialType(CreateTimetableDto) {}

export class TimetableResponseDto {
  id: string;
  teachingAssignmentId: string;
  academicYearId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  room?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  teachingAssignment?: {
    id: string;
    startDate: Date;
    endDate?: Date;
    teacher: {
      id: string;
      matricule: string;
      user: {
        id: string;
        firstName: string;
        lastName: string;
        email?: string;
      };
    };
    classSubject: {
      id: string;
      coefficient: number;
      weeklyHours: number;
      class: {
        id: string;
        name: string;
        code: string;
      };
      subject: {
        id: string;
        name: string;
        code: string;
      };
    };
  };
  academicYear?: {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
  };
}

export class WeeklyTimetableDto {
  classId: string;
  className: string;
  academicYearId: string;
  schedule: {
    [key in DayOfWeek]?: Array<{
      id: string;
      startTime: string;
      endTime: string;
      subject: string;
      teacher: string;
      room?: string;
      teachingAssignmentId: string;
    }>;
  };
}
