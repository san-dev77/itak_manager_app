import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(req: any, loginDto: LoginDto): import("./auth.service").LoginResponse;
    register(registerDto: RegisterDto): Promise<import("./auth.service").RegisterResponse>;
    logout(): Promise<{
        message: string;
    }>;
    refreshToken(refreshToken: string): Promise<{
        access_token: string;
    }>;
    getProfile(user: any): Promise<any>;
}
