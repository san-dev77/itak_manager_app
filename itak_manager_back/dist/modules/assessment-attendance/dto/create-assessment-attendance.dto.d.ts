import { AttendanceStatus } from '../../../entities/assessment-attendance.entity';
export declare class CreateAssessmentAttendanceDto {
    assessmentId: string;
    studentId: string;
    status: AttendanceStatus;
    reason?: string;
    markedBy?: string;
}
