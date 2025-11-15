"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../user/user.service");
const bcrypt = __importStar(require("bcrypt"));
let AuthService = class AuthService {
    userService;
    jwtService;
    configService;
    constructor(userService, jwtService, configService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async validateUser(email, password) {
        try {
            const user = await this.userService.getUserByEmailWithPassword(email);
            if (!user || !user.isActive) {
                return null;
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return null;
            }
            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        catch {
            return null;
        }
    }
    login(user) {
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
    async register(registerDto) {
        try {
            const newUser = await this.userService.createUser(registerDto);
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
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de l'inscription: ${errorMessage}`);
        }
    }
    logout() {
        return Promise.resolve({ message: 'Déconnexion réussie' });
    }
    async refreshToken(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken);
            const user = await this.userService.getUserByEmail(payload.email);
            if (!user || !user.isActive) {
                throw new common_1.UnauthorizedException('Utilisateur non trouvé ou inactif');
            }
            const newPayload = {
                sub: user.id,
                email: user.email,
                role: user.role,
            };
            const accessToken = this.jwtService.sign(newPayload);
            return { access_token: accessToken };
        }
        catch {
            throw new common_1.UnauthorizedException('Token de rafraîchissement invalide');
        }
    }
    async getCurrentUser(user) {
        try {
            return await this.userService.getUserByEmail(user.email);
        }
        catch {
            throw new common_1.UnauthorizedException("Erreur lors de la récupération de l'utilisateur");
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map