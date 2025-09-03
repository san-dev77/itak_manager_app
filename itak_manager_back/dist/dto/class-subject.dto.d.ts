export declare class CreateClassSubjectDto {
    class_id: number;
    subject_id: number;
    coefficient: number;
    weekly_hours?: number;
    is_optional?: boolean;
}
export declare class UpdateClassSubjectDto {
    class_id?: number;
    subject_id?: number;
    coefficient?: number;
    weekly_hours?: number;
    is_optional?: boolean;
}
