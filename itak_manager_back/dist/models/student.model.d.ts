export interface Student {
    id?: number;
    user_id: number;
    matricule: string;
    enrollment_date: string | Date;
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
export interface CreateStudentDto {
    user_id: number;
    matricule: string;
    enrollment_date: string | Date;
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
export interface UpdateStudentDto {
    matricule?: string;
    enrollment_date?: string | Date;
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
export interface StudentResponse {
    id: number;
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
    user?: {
        id: number;
        username: string;
        email: string;
        first_name: string;
        last_name: string;
        role: string;
    };
}
