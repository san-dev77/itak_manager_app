import { LoginDto, RegisterDto } from '../dto/auth.dto';
import { UserService } from './user.service';
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
}
export interface RegisterResponse {
    message: string;
    user: any;
    access_token: string | null;
}
export declare class AuthService {
    private readonly userService;
    constructor(userService: UserService);
    login(loginDto: LoginDto): Promise<LoginResponse>;
    register(registerDto: RegisterDto): Promise<RegisterResponse>;
    logout(accessToken: string): Promise<{
        message: string;
    }>;
    refreshToken(refreshToken: string): Promise<{
        access_token: string;
    }>;
    getCurrentUser(accessToken: string): Promise<any>;
}
