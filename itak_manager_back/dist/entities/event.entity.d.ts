import { Class } from './class.entity';
import { User } from './user.entity';
import { SchoolYear } from './school-year.entity';
export declare enum EventType {
    EXAM = "exam",
    HOMEWORK = "homework",
    CULTURAL_DAY = "cultural_day",
    HEALTH_DAY = "health_day",
    BALL = "ball",
    OTHER = "other"
}
export declare class Event {
    id: string;
    title: string;
    description?: string;
    eventType: EventType;
    startDate: Date;
    endDate?: Date;
    allDay: boolean;
    classId?: string;
    createdBy: string;
    academicYearId: string;
    createdAt: Date;
    updatedAt: Date;
    class?: Class;
    creator: User;
    academicYear: SchoolYear;
    participants: any[];
}
