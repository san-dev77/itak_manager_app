import { Assessment } from './assessment.entity';
import { User } from './user.entity';
export declare enum FileType {
    PDF = "pdf",
    DOC = "doc",
    DOCX = "docx",
    ODT = "odt"
}
export declare class AssessmentSubject {
    id: string;
    assessmentId: string;
    fileUrl: string;
    fileType: FileType;
    uploadedBy: string;
    createdAt: Date;
    updatedAt: Date;
    assessment: Assessment;
    uploadedByUser: User;
}
