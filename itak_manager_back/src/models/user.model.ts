export interface User {
  id?: number;
  username: string;
  email: string;
  password_hash?: string;
  role: 'student' | 'teacher' | 'staff' | 'parent' | 'admin';
  first_name: string;
  last_name: string;
  gender?: string;
  birth_date?: Date | string;
  phone?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  role: 'student' | 'teacher' | 'staff' | 'parent' | 'admin';
  first_name: string;
  last_name: string;
  gender?: string;
  birth_date?: Date | string;
  phone?: string;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  role?: 'student' | 'teacher' | 'staff' | 'parent' | 'admin';
  first_name?: string;
  last_name?: string;
  gender?: string;
  birth_date?: Date | string;
  phone?: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  role: 'student' | 'teacher' | 'staff' | 'parent' | 'admin';
  first_name: string;
  last_name: string;
  gender?: string;
  birth_date?: Date | string;
  phone?: string;
  created_at: Date;
  updated_at: Date;
}
