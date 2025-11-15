import { Repository } from 'typeorm';
import { EventParticipant, ParticipantStatus } from '../../entities/event-participant.entity';
import { Event } from '../../entities/event.entity';
import { User } from '../../entities/user.entity';
import { CreateEventParticipantDto, UpdateEventParticipantDto, BulkInviteParticipantsDto, UpdateParticipantStatusDto } from './dto/event-participant.dto';
export declare class EventParticipantService {
    private readonly eventParticipantRepository;
    private readonly eventRepository;
    private readonly userRepository;
    constructor(eventParticipantRepository: Repository<EventParticipant>, eventRepository: Repository<Event>, userRepository: Repository<User>);
    create(createEventParticipantDto: CreateEventParticipantDto): Promise<EventParticipant>;
    bulkInvite(bulkInviteDto: BulkInviteParticipantsDto): Promise<EventParticipant[]>;
    findAll(): Promise<EventParticipant[]>;
    findOne(id: string): Promise<EventParticipant>;
    findByEvent(eventId: string): Promise<EventParticipant[]>;
    findByUser(userId: string): Promise<EventParticipant[]>;
    findByStatus(eventId: string, status: ParticipantStatus): Promise<EventParticipant[]>;
    updateStatus(id: string, updateStatusDto: UpdateParticipantStatusDto): Promise<EventParticipant>;
    update(id: string, updateEventParticipantDto: UpdateEventParticipantDto): Promise<EventParticipant>;
    remove(id: string): Promise<void>;
    removeByEventAndUser(eventId: string, userId: string): Promise<void>;
    getEventStatistics(eventId: string): Promise<{
        total: number;
        invited: number;
        confirmed: number;
        declined: number;
        absent: number;
    }>;
}
