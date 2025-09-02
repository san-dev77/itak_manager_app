"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const supabase_config_1 = require("../config/supabase.config");
const user_service_1 = require("./user.service");
let AuthService = class AuthService {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async login(loginDto) {
        try {
            const { data, error } = await supabase_config_1.supabase.auth.signInWithPassword({
                email: loginDto.email,
                password: loginDto.password,
            });
            if (error) {
                console.error('Erreur Supabase Auth:', error);
                if (error.message === 'Email not confirmed') {
                    throw new common_1.UnauthorizedException('Veuillez confirmer votre email avant de vous connecter');
                }
                if (error.message === 'Invalid login credentials') {
                    throw new common_1.UnauthorizedException('Email ou mot de passe incorrect');
                }
                throw new common_1.UnauthorizedException(`Erreur d'authentification: ${error.message}`);
            }
            if (!data.user || !data.session) {
                throw new common_1.UnauthorizedException("Échec de l'authentification");
            }
            try {
                const userProfile = await this.userService.getUserByEmail(loginDto.email);
                return {
                    message: 'Connexion réussie',
                    user: userProfile,
                    access_token: data.session.access_token,
                };
            }
            catch (profileError) {
                console.warn('Profil utilisateur non trouvé, utilisation des données Auth:', profileError.message);
                return {
                    message: 'Connexion réussie (profil incomplet)',
                    user: {
                        id: data.user.id,
                        email: data.user.email,
                        username: data.user.email?.split('@')[0] || 'user',
                        role: 'student',
                        first_name: 'Utilisateur',
                        last_name: 'Connecté',
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                    access_token: data.session.access_token,
                };
            }
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            console.error('Erreur login:', error);
            throw new common_1.UnauthorizedException('Erreur lors de la connexion');
        }
    }
    async register(registerDto) {
        try {
            const newUser = await this.userService.createUser(registerDto);
            try {
                const { data, error } = await supabase_config_1.supabase.auth.signInWithPassword({
                    email: registerDto.email,
                    password: registerDto.password,
                });
                if (error || !data.session) {
                    throw new Error("Erreur lors de l'authentification après inscription");
                }
                return {
                    message: 'Inscription réussie et connexion automatique',
                    user: newUser,
                    access_token: data.session.access_token,
                };
            }
            catch (authError) {
                if (authError.message?.includes('Email not confirmed')) {
                    return {
                        message: 'Inscription réussie ! Veuillez confirmer votre email avant de vous connecter.',
                        user: newUser,
                        access_token: null,
                    };
                }
                throw authError;
            }
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new Error(`Erreur lors de l'inscription: ${error.message}`);
        }
    }
    async logout(accessToken) {
        try {
            const { error } = await supabase_config_1.supabase.auth.signOut();
            if (error) {
                throw new Error('Erreur lors de la déconnexion');
            }
            return { message: 'Déconnexion réussie' };
        }
        catch (error) {
            throw new Error(`Erreur lors de la déconnexion: ${error.message}`);
        }
    }
    async refreshToken(refreshToken) {
        try {
            const { data, error } = await supabase_config_1.supabase.auth.refreshSession({
                refresh_token: refreshToken,
            });
            if (error || !data.session) {
                throw new common_1.UnauthorizedException('Token de rafraîchissement invalide');
            }
            return { access_token: data.session.access_token };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Erreur lors du rafraîchissement du token');
        }
    }
    async getCurrentUser(accessToken) {
        try {
            const { data: { user }, error, } = await supabase_config_1.supabase.auth.getUser(accessToken);
            if (error || !user || !user.email) {
                throw new common_1.UnauthorizedException('Token invalide ou expiré');
            }
            return await this.userService.getUserByEmail(user.email);
        }
        catch (error) {
            throw new common_1.UnauthorizedException("Erreur lors de la récupération de l'utilisateur");
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], AuthService);
//# sourceMappingURL=auth.service.js.map