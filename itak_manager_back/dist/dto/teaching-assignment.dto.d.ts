export declare class CreateTeachingAssignmentDto {
    teacher_id: number;
    class_subject_id: number;
    start_date: string | Date;
    end_date?: string | Date;
}
export declare class UpdateTeachingAssignmentDto {
    teacher_id?: number;
    class_subject_id?: number;
    start_date?: string | Date;
    end_date?: string | Date;
}
