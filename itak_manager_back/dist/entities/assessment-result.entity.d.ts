import { Assessment } from './assessment.entity';
import { Student } from './student.entity';
export declare enum AssessmentResultStatus {
    PRESENT = "present",
    ABSENT = "absent",
    EXCUSED = "excused",
    EXCLUDED = "excluded"
}
export declare class AssessmentResult {
    id: string;
    assessmentId: string;
    studentId: string;
    score: number;
    remarks: string;
    status: AssessmentResultStatus;
    createdAt: Date;
    updatedAt: Date;
    assessment: Assessment;
    student: Student;
}
