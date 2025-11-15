import { EventParticipantService } from './event-participant.service';
import { CreateEventParticipantDto, UpdateEventParticipantDto, BulkInviteParticipantsDto, UpdateParticipantStatusDto } from './dto/event-participant.dto';
import { ParticipantStatus } from '../../entities/event-participant.entity';
export declare class EventParticipantController {
    private readonly eventParticipantService;
    constructor(eventParticipantService: EventParticipantService);
    create(createEventParticipantDto: CreateEventParticipantDto): Promise<import("../../entities/event-participant.entity").EventParticipant>;
    bulkInvite(bulkInviteDto: BulkInviteParticipantsDto): Promise<import("../../entities/event-participant.entity").EventParticipant[]>;
    findAll(): Promise<import("../../entities/event-participant.entity").EventParticipant[]>;
    findByEvent(eventId: string): Promise<import("../../entities/event-participant.entity").EventParticipant[]>;
    findByUser(userId: string): Promise<import("../../entities/event-participant.entity").EventParticipant[]>;
    findByStatus(eventId: string, status: ParticipantStatus): Promise<import("../../entities/event-participant.entity").EventParticipant[]>;
    getEventStatistics(eventId: string): Promise<{
        total: number;
        invited: number;
        confirmed: number;
        declined: number;
        absent: number;
    }>;
    findOne(id: string): Promise<import("../../entities/event-participant.entity").EventParticipant>;
    updateStatus(id: string, updateStatusDto: UpdateParticipantStatusDto): Promise<import("../../entities/event-participant.entity").EventParticipant>;
    update(id: string, updateEventParticipantDto: UpdateEventParticipantDto): Promise<import("../../entities/event-participant.entity").EventParticipant>;
    remove(id: string): Promise<{
        message: string;
    }>;
    removeByEventAndUser(eventId: string, userId: string): Promise<{
        message: string;
    }>;
}
