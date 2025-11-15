import { ComplaintStatus } from '../../../entities/grade-complaint.entity';
export declare class CreateGradeComplaintDto {
    studentId: string;
    assessmentId: string;
    reason: string;
}
export declare class UpdateGradeComplaintStatusDto {
    status: ComplaintStatus;
    comment?: string;
    newScore?: number;
}
export declare class GradeComplaintResponseDto {
    id: string;
    studentId: string;
    studentName: string;
    studentMatricule: string;
    assessmentId: string;
    assessmentTitle: string;
    currentScore: number;
    maxScore: number;
    status: ComplaintStatus;
    reason: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class GradeComplaintHistoryResponseDto {
    id: string;
    complaintId: string;
    oldScore: number;
    newScore: number;
    changedBy: string;
    changedByName: string;
    changedAt: Date;
    comment: string;
}
