import { AssessmentResultStatus } from '../../../entities/assessment-result.entity';
export declare class CreateAssessmentResultDto {
    assessmentId: string;
    studentId: string;
    score: number;
    remarks?: string;
    status?: AssessmentResultStatus;
}
export declare class UpdateAssessmentResultDto {
    score?: number;
    remarks?: string;
    status?: AssessmentResultStatus;
}
export declare class AssessmentResultResponseDto {
    id: string;
    assessmentId: string;
    assessmentTitle: string;
    assessmentMaxScore: number;
    studentId: string;
    studentName: string;
    studentMatricule: string;
    score: number;
    percentage: number;
    remarks: string;
    status: AssessmentResultStatus;
    createdAt: Date;
    updatedAt: Date;
}
export declare class BulkCreateAssessmentResultDto {
    assessmentId: string;
    results: Omit<CreateAssessmentResultDto, 'assessmentId'>[];
}
