import { User } from '../entities/user.entity';
import { UserResponseDto } from '../modules/auth/dto/user-response.dto';
export declare class Utils {
    static toResponseDto(user: User): UserResponseDto;
    static generateRandomString(length: number): string;
    static hashPassword(password: string): Promise<string>;
    static comparePassword(password: string, hashedPassword: string): Promise<boolean>;
}
