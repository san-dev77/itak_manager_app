import { TeachingAssignment } from './teaching-assignment.entity';
import { SchoolYear } from './school-year.entity';
export declare enum DayOfWeek {
    MONDAY = "Monday",
    TUESDAY = "Tuesday",
    WEDNESDAY = "Wednesday",
    THURSDAY = "Thursday",
    FRIDAY = "Friday",
    SATURDAY = "Saturday"
}
export declare class Timetable {
    id: string;
    teachingAssignmentId: string;
    academicYearId: string;
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    room?: string;
    createdAt: Date;
    updatedAt: Date;
    teachingAssignment: TeachingAssignment;
    academicYear: SchoolYear;
}
