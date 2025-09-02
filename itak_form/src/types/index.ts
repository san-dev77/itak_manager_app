export interface User {
  id: number;
  username: string;
  email: string;
  role: "student" | "teacher" | "staff" | "parent" | "admin";
  first_name: string;
  last_name: string;
  gender?: string;
  birth_date?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthFormData {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  gender?: string;
  birth_date?: string;
  phone?: string;
  role: "student" | "teacher" | "staff" | "parent" | "admin";
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
