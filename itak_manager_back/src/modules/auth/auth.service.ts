import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
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

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      // Récupérer l'utilisateur par email avec le mot de passe
      const user = await this.userService.getUserByEmailWithPassword(email);

      if (!user || !user.isActive) {
        return null;
      }

      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return null;
      }

      // Retourner l'utilisateur sans le mot de passe
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch {
      return null;
    }
  }

  login(user: any): LoginResponse {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return {
      message: 'Connexion réussie',
      user,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async register(registerDto: RegisterDto): Promise<RegisterResponse> {
    try {
      // Créer l'utilisateur avec le service existant
      const newUser = await this.userService.createUser(registerDto);

      // Générer un token d'accès pour l'utilisateur nouvellement créé
      const payload = {
        sub: newUser.id,
        email: newUser.email,
        role: newUser.role,
      };

      const accessToken = this.jwtService.sign(payload);

      return {
        message: 'Inscription réussie et connexion automatique',
        user: newUser,
        access_token: accessToken,
      };
    } catch (error) {
      console.error('Erreur dans AuthService.register:', error);
      if (error instanceof ConflictException) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new InternalServerErrorException(
        `Erreur lors de l'inscription: ${errorMessage}`,
      );
    }
  }

  logout(): Promise<{ message: string }> {
    // Avec JWT, la déconnexion côté serveur n'est pas nécessaire
    // Le token expire automatiquement
    return Promise.resolve({ message: 'Déconnexion réussie' });
  }

  async refreshToken(refreshToken: string): Promise<{ access_token: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken);

      const user = await this.userService.getUserByEmail(payload.email);
      if (!user || !user.isActive) {
        throw new UnauthorizedException('Utilisateur non trouvé ou inactif');
      }

      const newPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      const accessToken = this.jwtService.sign(newPayload);
      return { access_token: accessToken };
    } catch {
      throw new UnauthorizedException('Token de rafraîchissement invalide');
    }
  }

  async getCurrentUser(user: any): Promise<any> {
    try {
      return await this.userService.getUserByEmail(user.email);
    } catch {
      throw new UnauthorizedException(
        "Erreur lors de la récupération de l'utilisateur",
      );
    }
  }
}
