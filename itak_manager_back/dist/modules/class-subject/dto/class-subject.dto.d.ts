export declare class CreateClassSubjectDto {
    classId: string;
    subjectId: string;
    coefficient: number;
    weeklyHours?: number;
    isOptional?: boolean;
}
declare const UpdateClassSubjectDto_base: import("@nestjs/common").Type<Partial<CreateClassSubjectDto>>;
export declare class UpdateClassSubjectDto extends UpdateClassSubjectDto_base {
}
export declare class ClassSubjectResponseDto {
    id: string;
    classId: string;
    subjectId: string;
    coefficient: number;
    weeklyHours: number;
    isOptional: boolean;
    createdAt: Date;
    updatedAt: Date;
    class?: {
        id: string;
        name: string;
        code: string;
        description: string;
    };
    subject?: {
        id: string;
        name: string;
        code: string;
    };
}
export {};
