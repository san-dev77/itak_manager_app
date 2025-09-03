import { StaffService } from '../services/staff.service';
import { CreateStaffDto, UpdateStaffDto } from '../dto/staff.dto';
import type { StaffResponse } from '../models/staff.model';
export declare class StaffController {
    private readonly staffService;
    constructor(staffService: StaffService);
    createStaff(createStaffDto: CreateStaffDto): Promise<StaffResponse>;
    getAllStaff(): Promise<StaffResponse[]>;
    getStaffById(id: string): Promise<StaffResponse>;
    getStaffByUserId(userId: string): Promise<StaffResponse>;
    getStaffByMatricule(matricule: string): Promise<StaffResponse>;
    getStaffByPosition(position: string): Promise<StaffResponse[]>;
    updateStaff(id: string, updateStaffDto: UpdateStaffDto): Promise<StaffResponse>;
    deleteStaff(id: string): Promise<{
        message: string;
    }>;
}
