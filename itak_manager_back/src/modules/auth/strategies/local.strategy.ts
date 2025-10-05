import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email', // Utiliser email au lieu de username
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const result = await this.authService.validateUser(email, password);

    if (!result) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    return result;
  }
}
