export declare class CreateUserDto {
    username: string;
    email: string;
    password: string;
    role: 'student' | 'teacher' | 'staff' | 'parent' | 'admin';
    first_name: string;
    last_name: string;
    gender?: string;
    birth_date?: string;
    phone?: string;
}
export declare class UpdateUserDto {
    username?: string;
    first_name?: string;
    last_name?: string;
    role?: 'student' | 'teacher' | 'staff' | 'parent' | 'admin';
    gender?: string;
    birth_date?: string;
    phone?: string;
}
