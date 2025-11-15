export declare enum AssessmentType {
    EXAM = "exam",
    HOMEWORK = "homework",
    SUPERVISED_HOMEWORK = "supervised_homework",
    TEST = "test",
    QUIZ = "quiz",
    MONTHLY_COMPOSITION = "monthly_composition",
    CONTINUOUS_ASSESSMENT = "continuous_assessment"
}
export declare class CreateAssessmentDto {
    termId: string;
    classSubjectId: string;
    type?: AssessmentType;
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
    maxScore?: number;
    weight?: number;
}
declare const UpdateAssessmentDto_base: import("@nestjs/common").Type<Partial<CreateAssessmentDto>>;
export declare class UpdateAssessmentDto extends UpdateAssessmentDto_base {
}
export declare class AssessmentResponseDto {
    id: string;
    termId: string;
    termName: string;
    classSubjectId: string;
    className: string;
    subjectName: string;
    type: AssessmentType;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    maxScore: number;
    weight: number;
    createdAt: Date;
    updatedAt: Date;
}
export {};
