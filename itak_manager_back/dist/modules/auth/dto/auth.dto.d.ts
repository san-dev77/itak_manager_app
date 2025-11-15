import { UserRole } from '../../../entities/user.entity';
export declare class RegisterDto {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: UserRole;
}
export declare class LoginDto {
    email: string;
    password: string;
}
