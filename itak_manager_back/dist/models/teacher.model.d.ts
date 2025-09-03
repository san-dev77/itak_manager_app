export interface Teacher {
    id?: number;
    user_id: number;
    matricule: string;
    hire_date: string | Date;
    photo?: string;
    marital_status?: string;
    specialty: string;
    diplomas?: string;
    address?: string;
    emergency_contact?: string;
    notes?: string;
}
export interface CreateTeacherDto {
    user_id: number;
    matricule: string;
    hire_date: string | Date;
    photo?: string;
    marital_status?: string;
    specialty: string;
    diplomas?: string;
    address?: string;
    emergency_contact?: string;
    notes?: string;
}
export interface UpdateTeacherDto {
    matricule?: string;
    hire_date?: string | Date;
    photo?: string;
    marital_status?: string;
    specialty?: string;
    diplomas?: string;
    address?: string;
    emergency_contact?: string;
    notes?: string;
}
export interface TeacherResponse {
    id: number;
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
    user?: {
        id: number;
        username: string;
        email: string;
        first_name: string;
        last_name: string;
        role: string;
    };
}
