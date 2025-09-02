import { UserService } from '../services/user.service';
import type { UserResponse } from '../models/user.model';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    createUser(createUserDto: CreateUserDto): Promise<UserResponse>;
    getAllUsers(): Promise<UserResponse[]>;
    getUserById(id: string): Promise<UserResponse>;
    getUserByEmail(email: string): Promise<UserResponse>;
    updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserResponse>;
    deleteUser(id: string): Promise<{
        message: string;
    }>;
    deactivateUser(id: string): Promise<UserResponse>;
    activateUser(id: string): Promise<UserResponse>;
}
