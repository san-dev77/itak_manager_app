import { EventType } from '../../../entities/event.entity';
export declare class CreateEventDto {
    title: string;
    description?: string;
    eventType: EventType;
    startDate: string;
    endDate?: string;
    allDay?: boolean;
    classId?: string;
    createdBy: string;
    academicYearId: string;
}
declare const UpdateEventDto_base: import("@nestjs/common").Type<Partial<CreateEventDto>>;
export declare class UpdateEventDto extends UpdateEventDto_base {
}
export declare class EventResponseDto {
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
        email: string;
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
            email: string;
        };
    }>;
}
export declare class EventCalendarDto {
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
export {};
