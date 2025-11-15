import { DayOfWeek } from '../../../entities/timetable.entity';
export declare class CreateTimetableDto {
    teachingAssignmentId: string;
    academicYearId: string;
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    room?: string;
}
declare const UpdateTimetableDto_base: import("@nestjs/common").Type<Partial<CreateTimetableDto>>;
export declare class UpdateTimetableDto extends UpdateTimetableDto_base {
}
export declare class TimetableResponseDto {
    id: string;
    teachingAssignmentId: string;
    academicYearId: string;
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    room?: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    teachingAssignment?: {
        id: string;
        startDate: Date;
        endDate?: Date;
        teacher: {
            id: string;
            matricule: string;
            user: {
                id: string;
                firstName: string;
                lastName: string;
                email: string;
            };
        };
        classSubject: {
            id: string;
            coefficient: number;
            weeklyHours: number;
            class: {
                id: string;
                name: string;
                code: string;
            };
            subject: {
                id: string;
                name: string;
                code: string;
            };
        };
    };
    academicYear?: {
        id: string;
        name: string;
        startDate: Date;
        endDate: Date;
    };
}
export declare class WeeklyTimetableDto {
    classId: string;
    className: string;
    academicYearId: string;
    schedule: {
        [key in DayOfWeek]?: Array<{
            id: string;
            startTime: string;
            endTime: string;
            subject: string;
            teacher: string;
            room?: string;
            teachingAssignmentId: string;
        }>;
    };
}
export {};
