import { StaffResponse, CreateStaffDto, UpdateStaffDto } from '../models/staff.model';
export declare class StaffService {
    private readonly tableName;
    createStaff(createStaffDto: CreateStaffDto): Promise<StaffResponse>;
    getAllStaff(): Promise<StaffResponse[]>;
    getStaffById(id: number): Promise<StaffResponse>;
    getStaffByUserId(userId: number): Promise<StaffResponse>;
    getStaffByMatricule(matricule: string): Promise<StaffResponse>;
    getStaffByPosition(position: string): Promise<StaffResponse[]>;
    updateStaff(id: number, updateStaffDto: UpdateStaffDto): Promise<StaffResponse>;
    deleteStaff(id: number): Promise<{
        message: string;
    }>;
    private mapToStaffResponse;
}
