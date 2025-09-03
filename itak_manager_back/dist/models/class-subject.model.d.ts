export interface ClassSubject {
    id?: number;
    class_id: number;
    subject_id: number;
    coefficient: number;
    weekly_hours?: number;
    is_optional: boolean;
    created_at?: Date;
}
export interface CreateClassSubjectDto {
    class_id: number;
    subject_id: number;
    coefficient: number;
    weekly_hours?: number;
    is_optional?: boolean;
}
export interface UpdateClassSubjectDto {
    class_id?: number;
    subject_id?: number;
    coefficient?: number;
    weekly_hours?: number;
    is_optional?: boolean;
}
export interface ClassSubjectResponse {
    id: number;
    class_id: number;
    subject_id: number;
    coefficient: number;
    weekly_hours?: number;
    is_optional: boolean;
    created_at: string;
    class?: {
        id: number;
        name: string;
        level: string;
    };
    subject?: {
        id: number;
        name: string;
        code: string;
    };
}
