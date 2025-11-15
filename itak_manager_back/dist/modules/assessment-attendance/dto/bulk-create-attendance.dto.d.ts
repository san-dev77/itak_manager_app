import { AttendanceStatus } from '../../../entities/assessment-attendance.entity';
export declare class StudentAttendanceDto {
    studentId: string;
    status: AttendanceStatus;
    reason?: string;
}
export declare class BulkCreateAttendanceDto {
    assessmentId: string;
    attendances: StudentAttendanceDto[];
    markedBy?: string;
}
