import { Student } from './student.entity';
import { Assessment } from './assessment.entity';
import { GradeComplaintHistory } from './grade-complaint-history.entity';
export declare enum ComplaintStatus {
    PENDING = "pending",
    UNDER_REVIEW = "under_review",
    APPROVED = "approved",
    REJECTED = "rejected"
}
export declare class GradeComplaint {
    id: string;
    studentId: string;
    assessmentId: string;
    status: ComplaintStatus;
    reason: string;
    createdAt: Date;
    updatedAt: Date;
    student: Student;
    assessment: Assessment;
    history: GradeComplaintHistory[];
}
