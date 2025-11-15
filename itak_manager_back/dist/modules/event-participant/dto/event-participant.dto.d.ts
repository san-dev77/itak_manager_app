import { ParticipantRole, ParticipantStatus } from '../../../entities/event-participant.entity';
export declare class CreateEventParticipantDto {
    eventId: string;
    userId: string;
    role: ParticipantRole;
    status?: ParticipantStatus;
}
declare const UpdateEventParticipantDto_base: import("@nestjs/common").Type<Partial<CreateEventParticipantDto>>;
export declare class UpdateEventParticipantDto extends UpdateEventParticipantDto_base {
}
export declare class EventParticipantResponseDto {
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
export declare class BulkInviteParticipantsDto {
    eventId: string;
    participants: Array<{
        userId: string;
        role: ParticipantRole;
    }>;
}
export declare class UpdateParticipantStatusDto {
    status: ParticipantStatus;
}
export {};
