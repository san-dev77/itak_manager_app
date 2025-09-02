import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { supabase } from '../config/supabase.config';
import { User, UserResponse } from '../models/user.model';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { RegisterDto } from '../dto/auth.dto';

@Injectable()
export class UserService {
  private readonly tableName = 'users';

  async createUser(
    createUserDto: CreateUserDto | RegisterDto,
  ): Promise<UserResponse> {
    try {
      // Vérifier si l'utilisateur existe déjà
      const { data: existingUser } = await supabase
        .from(this.tableName)
        .select('id')
        .eq('email', createUserDto.email)
        .single();

      if (existingUser) {
        throw new ConflictException(
          'Un utilisateur avec cet email existe déjà',
        );
      }

      // Créer l'utilisateur dans Supabase Auth
      const { data: authUser, error: authError } = await supabase.auth.signUp({
        email: createUserDto.email,
        password: createUserDto.password,
      });

      if (authError) {
        throw new Error(`Erreur d'authentification: ${authError.message}`);
      }

      // Créer le profil utilisateur dans la table users
      const userProfile = {
        username: createUserDto.username,
        email: createUserDto.email,
        password_hash: createUserDto.password, // Note: devrait être hashé en production
        role: createUserDto.role,
        first_name: createUserDto.first_name,
        last_name: createUserDto.last_name,
        gender: 'gender' in createUserDto ? createUserDto.gender : undefined,
        birth_date:
          'birth_date' in createUserDto ? createUserDto.birth_date : undefined,
        phone: 'phone' in createUserDto ? createUserDto.phone : undefined,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const { data: newUser, error: profileError } = await supabase
        .from(this.tableName)
        .insert(userProfile)
        .select()
        .single();

      if (profileError) {
        throw new Error(
          `Erreur de création du profil: ${profileError.message}`,
        );
      }

      return this.mapToUserResponse(newUser);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la création de l'utilisateur: ${error.message}`,
      );
    }
  }

  async getAllUsers(): Promise<UserResponse[]> {
    try {
      const { data: users, error } = await supabase
        .from(this.tableName)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(
          `Erreur lors de la récupération des utilisateurs: ${error.message}`,
        );
      }

      return users.map((user) => this.mapToUserResponse(user));
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des utilisateurs: ${error.message}`,
      );
    }
  }

  async getUserById(id: number): Promise<UserResponse> {
    try {
      const { data: user, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error || !user) {
        throw new NotFoundException('Utilisateur non trouvé');
      }

      return this.mapToUserResponse(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la récupération de l'utilisateur: ${error.message}`,
      );
    }
  }

  async getUserByEmail(email: string): Promise<UserResponse> {
    try {
      const { data: user, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('email', email)
        .single();

      if (error || !user) {
        throw new NotFoundException('Utilisateur non trouvé');
      }

      return this.mapToUserResponse(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la récupération de l'utilisateur: ${error.message}`,
      );
    }
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    try {
      // Vérifier que l'utilisateur existe
      await this.getUserById(id);

      const updateData = {
        ...updateUserDto,
        updated_at: new Date(),
      };

      const { data: updatedUser, error } = await supabase
        .from(this.tableName)
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Erreur lors de la mise à jour: ${error.message}`);
      }

      return this.mapToUserResponse(updatedUser);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la mise à jour de l'utilisateur: ${error.message}`,
      );
    }
  }

  async deleteUser(id: number): Promise<{ message: string }> {
    try {
      // Vérifier que l'utilisateur existe
      await this.getUserById(id);

      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Erreur lors de la suppression: ${error.message}`);
      }

      return { message: 'Utilisateur supprimé avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la suppression de l'utilisateur: ${error.message}`,
      );
    }
  }

  // Méthodes d'activation/désactivation temporairement désactivées
  // car la colonne is_active n'existe pas encore dans la table
  async deactivateUser(id: number): Promise<UserResponse> {
    throw new Error(
      'Fonctionnalité non disponible - colonne is_active manquante',
    );
  }

  async activateUser(id: number): Promise<UserResponse> {
    throw new Error(
      'Fonctionnalité non disponible - colonne is_active manquante',
    );
  }

  private mapToUserResponse(user: any): UserResponse {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
      gender: user.gender,
      birth_date: user.birth_date,
      phone: user.phone,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }
}
