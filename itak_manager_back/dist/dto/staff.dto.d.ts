export declare class CreateStaffDto {
    user_id: number;
    matricule: string;
    hire_date: string;
    position: string;
    photo?: string;
    marital_status?: string;
    address?: string;
    emergency_contact?: string;
    notes?: string;
}
export declare class UpdateStaffDto {
    matricule?: string;
    hire_date?: string;
    position?: string;
    photo?: string;
    marital_status?: string;
    address?: string;
    emergency_contact?: string;
    notes?: string;
}
