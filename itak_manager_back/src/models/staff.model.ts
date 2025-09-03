export interface Staff {
  id?: number;
  user_id: number;
  matricule: string;
  hire_date: string | Date;
  position: string;
  photo?: string;
  marital_status?: string;
  address?: string;
  emergency_contact?: string;
  notes?: string;
}

export interface CreateStaffDto {
  user_id: number;
  matricule: string;
  hire_date: string | Date;
  position: string;
  photo?: string;
  marital_status?: string;
  address?: string;
  emergency_contact?: string;
  notes?: string;
}

export interface UpdateStaffDto {
  matricule?: string;
  hire_date?: string | Date;
  position?: string;
  photo?: string;
  marital_status?: string;
  address?: string;
  emergency_contact?: string;
  notes?: string;
}

export interface StaffResponse {
  id: number;
  user_id: number;
  matricule: string;
  hire_date: string;
  position: string;
  photo?: string;
  marital_status?: string;
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
