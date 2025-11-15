import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';
export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
}
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly userService;
    private readonly configService;
    constructor(userService: UserService, configService: ConfigService);
    validate(payload: JwtPayload): Promise<import("../../user/dto/user.dto").UserResponseDto>;
}
export {};
