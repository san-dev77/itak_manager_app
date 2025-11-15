import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto, UserResponseDto } from './dto/user.dto';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';
export declare class UserService {
    private userRepository;
    private emailService;
    private configService;
    constructor(userRepository: Repository<User>, emailService: EmailService, configService: ConfigService);
    createUser(createUserDto: CreateUserDto): Promise<UserResponseDto>;
    generateUsername(firstName: string, lastName: string): Promise<string>;
    private usernameExists;
    updatePassword(id: string, newPassword: string): Promise<void>;
    getAllUsers(): Promise<UserResponseDto[]>;
    getUserById(id: string): Promise<UserResponseDto>;
    getUserByEmail(email: string): Promise<UserResponseDto>;
    getUserByEmailWithPassword(email: string): Promise<User | null>;
    updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto>;
    deleteUser(id: string): Promise<{
        message: string;
    }>;
    deactivateUser(id: string): Promise<UserResponseDto>;
    activateUser(id: string): Promise<UserResponseDto>;
    private mapToUserResponseDto;
}
