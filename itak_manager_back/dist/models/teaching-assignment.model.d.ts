export interface TeachingAssignment {
    id?: number;
    teacher_id: number;
    class_subject_id: number;
    start_date: string | Date;
    end_date?: string | Date;
    created_at?: string | Date;
}
export interface CreateTeachingAssignmentDto {
    teacher_id: number;
    class_subject_id: number;
    start_date: string | Date;
    end_date?: string | Date;
}
export interface UpdateTeachingAssignmentDto {
    teacher_id?: number;
    class_subject_id?: number;
    start_date?: string | Date;
    end_date?: string | Date;
}
export interface TeachingAssignmentResponse {
    id: number;
    teacher_id: number;
    class_subject_id: number;
    start_date: string;
    end_date?: string;
    created_at: string;
    teacher?: {
        id: number;
        first_name: string;
        last_name: string;
    };
    class_subject?: {
        id: number;
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
        coefficient?: number;
        weekly_hours?: number;
    };
}
