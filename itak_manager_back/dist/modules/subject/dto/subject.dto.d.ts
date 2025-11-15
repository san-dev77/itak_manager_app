export declare class CreateSubjectDto {
    name: string;
    code: string;
}
declare const UpdateSubjectDto_base: import("@nestjs/common").Type<Partial<CreateSubjectDto>>;
export declare class UpdateSubjectDto extends UpdateSubjectDto_base {
}
export declare class SubjectResponseDto {
    id: string;
    name: string;
    code: string;
    createdAt: Date;
    updatedAt: Date;
}
export {};
