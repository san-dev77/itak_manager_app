import { UserResponse } from '../models/user.model';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { RegisterDto } from '../dto/auth.dto';
export declare class UserService {
    private readonly tableName;
    createUser(createUserDto: CreateUserDto | RegisterDto): Promise<UserResponse>;
    getAllUsers(): Promise<UserResponse[]>;
    getUserById(id: number): Promise<UserResponse>;
    getUserByEmail(email: string): Promise<UserResponse>;
    updateUser(id: number, updateUserDto: UpdateUserDto): Promise<UserResponse>;
    deleteUser(id: number): Promise<{
        message: string;
    }>;
    deactivateUser(id: number): Promise<UserResponse>;
    activateUser(id: number): Promise<UserResponse>;
    private mapToUserResponse;
}
