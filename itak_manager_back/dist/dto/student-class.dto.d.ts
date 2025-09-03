export declare class CreateStudentClassDto {
    student_id: number;
    class_id: number;
    start_date: string | Date;
    end_date?: string | Date;
}
export declare class UpdateStudentClassDto {
    student_id?: number;
    class_id?: number;
    start_date?: string | Date;
    end_date?: string | Date;
}
