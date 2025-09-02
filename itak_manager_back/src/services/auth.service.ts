import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { supabase } from '../config/supabase.config';
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

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    try {
      // Authentification avec Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginDto.email,
        password: loginDto.password,
      });

      if (error) {
        console.error('Erreur Supabase Auth:', error);

        // Gestion spécifique des erreurs Supabase
        if (error.message === 'Email not confirmed') {
          throw new UnauthorizedException(
            'Veuillez confirmer votre email avant de vous connecter',
          );
        }

        if (error.message === 'Invalid login credentials') {
          throw new UnauthorizedException('Email ou mot de passe incorrect');
        }

        throw new UnauthorizedException(
          `Erreur d'authentification: ${error.message}`,
        );
      }

      if (!data.user || !data.session) {
        throw new UnauthorizedException("Échec de l'authentification");
      }

      try {
        // Récupérer le profil utilisateur complet
        const userProfile = await this.userService.getUserByEmail(
          loginDto.email,
        );

        return {
          message: 'Connexion réussie',
          user: userProfile,
          access_token: data.session.access_token,
        };
      } catch (profileError) {
        // Si le profil n'existe pas, on peut quand même se connecter
        // mais on retourne juste les données de base
        console.warn(
          'Profil utilisateur non trouvé, utilisation des données Auth:',
          profileError.message,
        );

        return {
          message: 'Connexion réussie (profil incomplet)',
          user: {
            id: data.user.id,
            email: data.user.email,
            username: data.user.email?.split('@')[0] || 'user',
            role: 'student', // Rôle par défaut
            first_name: 'Utilisateur',
            last_name: 'Connecté',
            created_at: new Date(),
            updated_at: new Date(),
          },
          access_token: data.session.access_token,
        };
      }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('Erreur login:', error);
      throw new UnauthorizedException('Erreur lors de la connexion');
    }
  }

  async register(registerDto: RegisterDto): Promise<RegisterResponse> {
    try {
      // Créer l'utilisateur avec le service existant
      const newUser = await this.userService.createUser(registerDto);

      // Pour le développement, on peut essayer de confirmer l'email automatiquement
      // Note: En production, il faudrait gérer la confirmation d'email
      try {
        // Authentifier l'utilisateur après création
        const { data, error } = await supabase.auth.signInWithPassword({
          email: registerDto.email,
          password: registerDto.password,
        });

        if (error || !data.session) {
          throw new Error(
            "Erreur lors de l'authentification après inscription",
          );
        }

        return {
          message: 'Inscription réussie et connexion automatique',
          user: newUser,
          access_token: data.session.access_token,
        };
      } catch (authError) {
        // Si l'authentification échoue à cause de l'email non confirmé
        if (authError.message?.includes('Email not confirmed')) {
          return {
            message:
              'Inscription réussie ! Veuillez confirmer votre email avant de vous connecter.',
            user: newUser,
            access_token: null,
          };
        }
        throw authError;
      }
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error(`Erreur lors de l'inscription: ${error.message}`);
    }
  }

  async logout(accessToken: string): Promise<{ message: string }> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw new Error('Erreur lors de la déconnexion');
      }

      return { message: 'Déconnexion réussie' };
    } catch (error) {
      throw new Error(`Erreur lors de la déconnexion: ${error.message}`);
    }
  }

  async refreshToken(refreshToken: string): Promise<{ access_token: string }> {
    try {
      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken,
      });

      if (error || !data.session) {
        throw new UnauthorizedException('Token de rafraîchissement invalide');
      }

      return { access_token: data.session.access_token };
    } catch (error) {
      throw new UnauthorizedException(
        'Erreur lors du rafraîchissement du token',
      );
    }
  }

  async getCurrentUser(accessToken: string): Promise<any> {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(accessToken);

      if (error || !user || !user.email) {
        throw new UnauthorizedException('Token invalide ou expiré');
      }

      // Récupérer le profil complet
      return await this.userService.getUserByEmail(user.email);
    } catch (error) {
      throw new UnauthorizedException(
        "Erreur lors de la récupération de l'utilisateur",
      );
    }
  }
}
