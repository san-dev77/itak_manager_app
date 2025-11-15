import { UserRole } from '../../../entities/user.entity';
export declare class CreateUserDto {
    username?: string;
    email: string;
    firstName: string;
    lastName: string;
    gender?: string;
    birthDate?: string;
    phone?: string;
    role?: UserRole;
    isActive?: boolean;
    password?: string;
}
export declare class UpdateUserDto {
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    gender?: string;
    birthDate?: string;
    phone?: string;
    role?: UserRole;
    isActive?: boolean;
}
export declare class UserResponseDto {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    gender?: string;
    birthDate?: Date;
    phone?: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
