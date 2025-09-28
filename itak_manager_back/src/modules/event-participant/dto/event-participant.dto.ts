import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsUUID, IsOptional } from 'class-validator';
import {
  ParticipantRole,
  ParticipantStatus,
} from '../../../entities/event-participant.entity';

export class CreateEventParticipantDto {
  @IsUUID('4', { message: 'eventId doit être un UUID valide' })
  eventId: string;

  @IsUUID('4', { message: 'userId doit être un UUID valide' })
  userId: string;

  @IsEnum(ParticipantRole, {
    message: 'Le rôle du participant doit être valide',
  })
  role: ParticipantRole;

  @IsOptional()
  @IsEnum(ParticipantStatus, {
    message: 'Le statut du participant doit être valide',
  })
  status?: ParticipantStatus;
}

export class UpdateEventParticipantDto extends PartialType(
  CreateEventParticipantDto,
) {}

export class EventParticipantResponseDto {
  id: string;
  eventId: string;
  userId: string;
  role: ParticipantRole;
  status: ParticipantStatus;
  event?: {
    id: string;
    title: string;
    eventType: string;
    startDate: Date;
    endDate?: Date;
  };
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export class BulkInviteParticipantsDto {
  @IsUUID('4', { message: 'eventId doit être un UUID valide' })
  eventId: string;

  participants: Array<{
    userId: string;
    role: ParticipantRole;
  }>;
}

export class UpdateParticipantStatusDto {
  @IsEnum(ParticipantStatus, {
    message: 'Le statut du participant doit être valide',
  })
  status: ParticipantStatus;
}
