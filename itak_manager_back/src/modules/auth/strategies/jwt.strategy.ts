import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        process.env.JWT_SECRET || 'default-secret-change-in-production',
    });
  }

  async validate(payload: JwtPayload) {
    try {
      const user = await this.userService.getUserByEmail(payload.email);

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Utilisateur non trouvé ou inactif');
      }

      // Retourner l'utilisateur qui sera attaché à req.user
      return user;
    } catch (error) {
      throw new UnauthorizedException('Token invalide');
    }
  }
}
