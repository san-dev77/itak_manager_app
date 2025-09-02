import { AuthService } from '../services/auth.service';
import { LoginDto, RegisterDto } from '../dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): unknown;
    register(registerDto: RegisterDto): unknown;
    logout(authHeader: string): unknown;
    refreshToken(refreshToken: string): unknown;
    getProfile(authHeader: string): unknown;
}
