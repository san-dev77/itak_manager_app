import { AuthService } from '../services/auth.service';
import { LoginDto, RegisterDto } from '../dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<import("../services/auth.service").LoginResponse>;
    register(registerDto: RegisterDto): Promise<import("../services/auth.service").RegisterResponse>;
    logout(authHeader: string): Promise<{
        message: string;
    }>;
    refreshToken(refreshToken: string): Promise<{
        access_token: string;
    }>;
    getProfile(authHeader: string): Promise<any>;
}
