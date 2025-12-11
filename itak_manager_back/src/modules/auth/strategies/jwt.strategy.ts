import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';

export interface JwtPayload {
  sub: string;
  email?: string;
  role: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    const jwtConfig = configService.get('jwt');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig?.secret || process.env.JWT_SECRET || 'dev-super-secret-jwt-key-change-in-production',
    });
  }

  async validate(payload: JwtPayload) {
    try {
      // Récupérer par ID (sub) si email non disponible
      let user;
      if (payload.email) {
        user = await this.userService.getUserByEmail(payload.email);
      } else {
        user = await this.userService.getUserById(payload.sub);
      }

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
