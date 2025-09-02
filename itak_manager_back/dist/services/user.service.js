"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const supabase_config_1 = require("../config/supabase.config");
let UserService = class UserService {
    tableName = 'users';
    async createUser(createUserDto) {
        try {
            const { data: existingUser } = await supabase_config_1.supabase
                .from(this.tableName)
                .select('id')
                .eq('email', createUserDto.email)
                .single();
            if (existingUser) {
                throw new common_1.ConflictException('Un utilisateur avec cet email existe déjà');
            }
            const { data: authUser, error: authError } = await supabase_config_1.supabase.auth.signUp({
                email: createUserDto.email,
                password: createUserDto.password,
            });
            if (authError) {
                throw new Error(`Erreur d'authentification: ${authError.message}`);
            }
            const userProfile = {
                username: createUserDto.username,
                email: createUserDto.email,
                password_hash: createUserDto.password,
                role: createUserDto.role,
                first_name: createUserDto.first_name,
                last_name: createUserDto.last_name,
                gender: 'gender' in createUserDto ? createUserDto.gender : undefined,
                birth_date: 'birth_date' in createUserDto ? createUserDto.birth_date : undefined,
                phone: 'phone' in createUserDto ? createUserDto.phone : undefined,
                created_at: new Date(),
                updated_at: new Date(),
            };
            const { data: newUser, error: profileError } = await supabase_config_1.supabase
                .from(this.tableName)
                .insert(userProfile)
                .select()
                .single();
            if (profileError) {
                throw new Error(`Erreur de création du profil: ${profileError.message}`);
            }
            return this.mapToUserResponse(newUser);
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new Error(`Erreur lors de la création de l'utilisateur: ${error.message}`);
        }
    }
    async getAllUsers() {
        try {
            const { data: users, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .select('*')
                .order('created_at', { ascending: false });
            if (error) {
                throw new Error(`Erreur lors de la récupération des utilisateurs: ${error.message}`);
            }
            return users.map((user) => this.mapToUserResponse(user));
        }
        catch (error) {
            throw new Error(`Erreur lors de la récupération des utilisateurs: ${error.message}`);
        }
    }
    async getUserById(id) {
        try {
            const { data: user, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .select('*')
                .eq('id', id)
                .single();
            if (error || !user) {
                throw new common_1.NotFoundException('Utilisateur non trouvé');
            }
            return this.mapToUserResponse(user);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Erreur lors de la récupération de l'utilisateur: ${error.message}`);
        }
    }
    async getUserByEmail(email) {
        try {
            const { data: user, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .select('*')
                .eq('email', email)
                .single();
            if (error || !user) {
                throw new common_1.NotFoundException('Utilisateur non trouvé');
            }
            return this.mapToUserResponse(user);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Erreur lors de la récupération de l'utilisateur: ${error.message}`);
        }
    }
    async updateUser(id, updateUserDto) {
        try {
            await this.getUserById(id);
            const updateData = {
                ...updateUserDto,
                updated_at: new Date(),
            };
            const { data: updatedUser, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .update(updateData)
                .eq('id', id)
                .select()
                .single();
            if (error) {
                throw new Error(`Erreur lors de la mise à jour: ${error.message}`);
            }
            return this.mapToUserResponse(updatedUser);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Erreur lors de la mise à jour de l'utilisateur: ${error.message}`);
        }
    }
    async deleteUser(id) {
        try {
            await this.getUserById(id);
            const { error } = await supabase_config_1.supabase
                .from(this.tableName)
                .delete()
                .eq('id', id);
            if (error) {
                throw new Error(`Erreur lors de la suppression: ${error.message}`);
            }
            return { message: 'Utilisateur supprimé avec succès' };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Erreur lors de la suppression de l'utilisateur: ${error.message}`);
        }
    }
    async deactivateUser(id) {
        throw new Error('Fonctionnalité non disponible - colonne is_active manquante');
    }
    async activateUser(id) {
        throw new Error('Fonctionnalité non disponible - colonne is_active manquante');
    }
    mapToUserResponse(user) {
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
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)()
], UserService);
//# sourceMappingURL=user.service.js.map