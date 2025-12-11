import { PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsUUID,
  IsDateString,
  IsBoolean,
  MaxLength,
} from 'class-validator';
import { EventType } from '../../../entities/event.entity';

export class CreateEventDto {
  @IsString({ message: 'Le titre doit être une chaîne' })
  @MaxLength(100, { message: 'Le titre ne peut pas dépasser 100 caractères' })
  title: string;

  @IsOptional()
  @IsString({ message: 'La description doit être une chaîne' })
  description?: string;

  @IsEnum(EventType, { message: "Le type d'événement doit être valide" })
  eventType: EventType;

  @IsDateString({}, { message: 'La date de début doit être valide' })
  startDate: string;

  @IsOptional()
  @IsDateString({}, { message: 'La date de fin doit être valide' })
  endDate?: string;

  @IsOptional()
  @IsBoolean({ message: 'allDay doit être un booléen' })
  allDay?: boolean;

  @IsOptional()
  @IsUUID('4', { message: 'classId doit être un UUID valide' })
  classId?: string;

  @IsUUID('4', { message: 'createdBy doit être un UUID valide' })
  createdBy: string;

  @IsUUID('4', { message: 'academicYearId doit être un UUID valide' })
  academicYearId: string;
}

export class UpdateEventDto extends PartialType(CreateEventDto) {}

export class EventResponseDto {
  id: string;
  title: string;
  description?: string;
  eventType: EventType;
  startDate: string | Date;
  endDate?: string | Date;
  allDay: boolean;
  classId?: string;
  createdBy: string;
  academicYearId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  class?: {
    id: string;
    name: string;
    level: string;
  };
  creator?: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
  academicYear?: {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
  };
  participants?: Array<{
    id: string;
    userId: string;
    role: string;
    status: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email?: string;
    };
  }>;
}

export class EventCalendarDto {
  date: string;
  events: Array<{
    id: string;
    title: string;
    eventType: EventType;
    startDate: string;
    endDate?: string;
    allDay: boolean;
    className?: string;
  }>;
}
