import { Repository } from 'typeorm';
import { Staff } from '../../entities/staff.entity';
import { User } from '../../entities/user.entity';
import { CreateStaffDto, StaffResponseDto, UpdateStaffDto } from './dto/staff.dto';
export declare class StaffService {
    private readonly staffRepository;
    private readonly userRepository;
    constructor(staffRepository: Repository<Staff>, userRepository: Repository<User>);
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
    private mapToStaffResponseDto;
}
