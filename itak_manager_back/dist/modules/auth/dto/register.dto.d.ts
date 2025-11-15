import { UserRole } from '../../../entities/user.entity';
export declare class RegisterDto {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    gender?: string;
    birthDate?: string;
    phone?: string;
}
