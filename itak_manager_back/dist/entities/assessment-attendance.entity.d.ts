import { Assessment } from './assessment.entity';
import { Student } from './student.entity';
export declare enum AttendanceStatus {
    PRESENT = "present",
    ABSENT = "absent",
    EXCUSED = "excused",
    EXCLUDED = "excluded"
}
export declare class AssessmentAttendance {
    assessmentId: string;
    studentId: string;
    status: AttendanceStatus;
    reason: string;
    markedBy: string;
    markedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    assessment: Assessment;
    student: Student;
}
