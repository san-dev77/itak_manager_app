import { User } from './user.entity';
export declare class Staff {
    id: string;
    userId: string;
    matricule: string;
    hireDate: Date;
    position: string;
    photo?: string;
    maritalStatus?: string;
    address?: string;
    emergencyContact?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
}
