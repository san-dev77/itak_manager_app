import { StaffService } from './staff.service';
import { CreateStaffDto, UpdateStaffDto, StaffResponseDto } from './dto/staff.dto';
export declare class StaffController {
    private readonly staffService;
    constructor(staffService: StaffService);
    createStaff(createStaffDto: CreateStaffDto): Promise<StaffResponseDto>;
    getAllStaff(): Promise<StaffResponseDto[]>;
    getStaffById(id: string): Promise<StaffResponseDto>;
    getStaffByUserId(userId: string): Promise<StaffResponseDto>;
    getStaffByMatricule(matricule: string): Promise<StaffResponseDto>;
    getStaffByPosition(position: string): Promise<StaffResponseDto[]>;
    updateStaff(id: string, updateStaffDto: UpdateStaffDto): Promise<StaffResponseDto>;
    deleteStaff(id: string): Promise<{
        message: string;
    }>;
}
