export declare class CreateTeacherDto {
    user_id: number;
    matricule: string;
    hire_date: string;
    photo?: string;
    marital_status?: string;
    specialty: string;
    diplomas?: string;
    address?: string;
    emergency_contact?: string;
    notes?: string;
}
export declare class UpdateTeacherDto {
    matricule?: string;
    hire_date?: string;
    photo?: string;
    marital_status?: string;
    specialty?: string;
    diplomas?: string;
    address?: string;
    emergency_contact?: string;
    notes?: string;
}
