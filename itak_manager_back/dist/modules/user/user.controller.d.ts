import { UserService } from './user.service';
import type { UserResponseDto } from './dto/user.dto';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    createUser(createUserDto: CreateUserDto): Promise<UserResponseDto>;
    getAllUsers(): Promise<UserResponseDto[]>;
    getUserById(id: string): Promise<UserResponseDto>;
    getUserByEmail(email: string): Promise<UserResponseDto>;
    updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto>;
    deleteUser(id: string): Promise<{
        message: string;
    }>;
    deactivateUser(id: string): Promise<UserResponseDto>;
    activateUser(id: string): Promise<UserResponseDto>;
}
