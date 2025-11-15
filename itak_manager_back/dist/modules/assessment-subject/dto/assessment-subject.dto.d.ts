import { FileType } from '../../../entities/assessment-subject.entity';
export declare class CreateAssessmentSubjectDto {
    assessmentId: string;
    fileType: FileType;
}
export declare class UpdateAssessmentSubjectDto {
    fileType?: FileType;
}
export declare class AssessmentSubjectResponseDto {
    id: string;
    assessmentId: string;
    assessmentTitle: string;
    fileUrl: string;
    fileType: FileType;
    uploadedBy: string;
    uploadedByName: string;
    originalFileName: string;
    fileSize: number;
    createdAt: Date;
    updatedAt: Date;
}
