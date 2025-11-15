import { UserRole } from '../../../entities/user.entity';
export declare class UpdateUserDto {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    role?: UserRole;
    isActive?: boolean;
}
