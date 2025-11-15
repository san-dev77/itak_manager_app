import { Repository } from 'typeorm';
import { Event, EventType } from '../../entities/event.entity';
import { Class } from '../../entities/class.entity';
import { User } from '../../entities/user.entity';
import { SchoolYear } from '../../entities/school-year.entity';
import { CreateEventDto, UpdateEventDto, EventCalendarDto } from './dto/event.dto';
export declare class EventService {
    private readonly eventRepository;
    private readonly classRepository;
    private readonly userRepository;
    private readonly schoolYearRepository;
    constructor(eventRepository: Repository<Event>, classRepository: Repository<Class>, userRepository: Repository<User>, schoolYearRepository: Repository<SchoolYear>);
    create(createEventDto: CreateEventDto): Promise<Event>;
    findAll(): Promise<Event[]>;
    findOne(id: string): Promise<Event>;
    findByClass(classId: string, academicYearId: string): Promise<Event[]>;
    findByDateRange(startDate: string, endDate: string, academicYearId?: string, classId?: string): Promise<Event[]>;
    findByType(eventType: EventType, academicYearId: string, classId?: string): Promise<Event[]>;
    getCalendarEvents(year: number, month: number, academicYearId?: string, classId?: string): Promise<EventCalendarDto[]>;
    getUpcomingEvents(academicYearId: string, limit?: number, classId?: string): Promise<Event[]>;
    update(id: string, updateEventDto: UpdateEventDto): Promise<Event>;
    remove(id: string): Promise<void>;
}
