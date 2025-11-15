import { UserResponseDto } from '../../user/dto/user.dto';
export declare class CreateStaffDto {
    userId: string;
    matricule: string;
    hireDate: string;
    position: string;
    photo?: string;
    maritalStatus?: string;
    address?: string;
    emergencyContact?: string;
    notes?: string;
}
declare const UpdateStaffDto_base: import("@nestjs/common").Type<Partial<CreateStaffDto>>;
export declare class UpdateStaffDto extends UpdateStaffDto_base {
}
export declare class StaffResponseDto {
    id: string;
    userId: string;
    matricule: string;
    hireDate: string | Date;
    position: string;
    photo?: string;
    maritalStatus?: string;
    address?: string;
    emergencyContact?: string;
    notes?: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    user?: UserResponseDto;
}
export {};
