import { EventService } from './event.service';
import { CreateEventDto, UpdateEventDto, EventCalendarDto } from './dto/event.dto';
import { EventType } from '../../entities/event.entity';
export declare class EventController {
    private readonly eventService;
    constructor(eventService: EventService);
    create(createEventDto: CreateEventDto): Promise<import("../../entities/event.entity").Event>;
    findAll(): Promise<import("../../entities/event.entity").Event[]>;
    findByClass(classId: string, academicYearId: string): Promise<import("../../entities/event.entity").Event[]>;
    findByDateRange(startDate: string, endDate: string, academicYearId?: string, classId?: string): Promise<import("../../entities/event.entity").Event[]>;
    findByType(eventType: EventType, academicYearId: string, classId?: string): Promise<import("../../entities/event.entity").Event[]>;
    getCalendarEvents(year: number, month: number, academicYearId?: string, classId?: string): Promise<EventCalendarDto[]>;
    getUpcomingEvents(academicYearId: string, limit?: number, classId?: string): Promise<import("../../entities/event.entity").Event[]>;
    findOne(id: string): Promise<import("../../entities/event.entity").Event>;
    update(id: string, updateEventDto: UpdateEventDto): Promise<import("../../entities/event.entity").Event>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
