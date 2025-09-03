export declare class CreateStudentDto {
    user_id: number;
    matricule: string;
    enrollment_date: string;
    photo?: string;
    marital_status?: string;
    father_name?: string;
    mother_name?: string;
    tutor_name?: string;
    tutor_phone?: string;
    address?: string;
    emergency_contact?: string;
    notes?: string;
}
export declare class UpdateStudentDto {
    matricule?: string;
    enrollment_date?: string;
    photo?: string;
    marital_status?: string;
    father_name?: string;
    mother_name?: string;
    tutor_name?: string;
    tutor_phone?: string;
    address?: string;
    emergency_contact?: string;
    notes?: string;
}
