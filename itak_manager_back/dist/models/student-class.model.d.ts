export interface StudentClass {
    id?: number;
    student_id: number;
    class_id: number;
    start_date: string | Date;
    end_date?: string | Date;
    created_at?: string | Date;
}
export interface CreateStudentClassDto {
    student_id: number;
    class_id: number;
    start_date: string | Date;
    end_date?: string | Date;
}
export interface UpdateStudentClassDto {
    student_id?: number;
    class_id?: number;
    start_date?: string | Date;
    end_date?: string | Date;
}
export interface StudentClassResponse {
    id: number;
    student_id: number;
    class_id: number;
    start_date: string;
    end_date?: string;
    created_at: string;
    student?: {
        id: number;
        first_name: string;
        last_name: string;
    };
    class?: {
        id: number;
        name: string;
        level: string;
    };
}
