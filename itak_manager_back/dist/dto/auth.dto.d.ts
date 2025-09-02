export declare class LoginDto {
    email: string;
    password: string;
}
export declare class RegisterDto {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role: 'student' | 'teacher' | 'staff' | 'parent' | 'admin';
}
