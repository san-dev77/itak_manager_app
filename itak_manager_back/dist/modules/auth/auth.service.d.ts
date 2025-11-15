import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
export interface AuthResponse {
    user: any;
    session: any;
    access_token: string;
    refresh_token: string;
}
export interface LoginResponse {
    message: string;
    user: any;
    access_token: string;
    refresh_token?: string;
}
export interface RegisterResponse {
    message: string;
    user: any;
    access_token: string | null;
}
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    private readonly configService;
    constructor(userService: UserService, jwtService: JwtService, configService: ConfigService);
    validateUser(email: string, password: string): Promise<any>;
    login(user: any): LoginResponse;
    register(registerDto: RegisterDto): Promise<RegisterResponse>;
    logout(): Promise<{
        message: string;
    }>;
    refreshToken(refreshToken: string): Promise<{
        access_token: string;
    }>;
    getCurrentUser(user: any): Promise<any>;
}
