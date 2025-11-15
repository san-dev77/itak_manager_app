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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../entities/user.entity");
const utils_1 = require("../../utils/utils");
const email_service_1 = require("../email/email.service");
const config_1 = require("@nestjs/config");
let UserService = class UserService {
    userRepository;
    emailService;
    configService;
    constructor(userRepository, emailService, configService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.configService = configService;
    }
    async createUser(createUserDto) {
        try {
            const existingUser = await this.userRepository.findOne({
                where: { email: createUserDto.email },
            });
            if (existingUser) {
                throw new common_1.ConflictException('Un utilisateur avec cet email existe déjà');
            }
            const password = createUserDto.password || utils_1.Utils.generateRandomString(10);
            const hashedPassword = await utils_1.Utils.hashPassword(password);
            const username = createUserDto.username ||
                (await this.generateUsername(createUserDto.firstName, createUserDto.lastName));
            const user = this.userRepository.create({
                username,
                email: createUserDto.email,
                firstName: createUserDto.firstName,
                lastName: createUserDto.lastName,
                gender: createUserDto.gender,
                birthDate: createUserDto.birthDate
                    ? new Date(createUserDto.birthDate)
                    : undefined,
                phone: createUserDto.phone,
                password: hashedPassword,
                role: createUserDto.role || user_entity_1.UserRole.STUDENT,
                isActive: true,
            });
            if (this.emailService) {
                try {
                    await this.emailService.sendWelcomeEmail({
                        firstName: createUserDto.firstName,
                        lastName: createUserDto.lastName,
                        email: createUserDto.email,
                        password,
                        role: createUserDto.role || user_entity_1.UserRole.STUDENT,
                        loginUrl: `${this.configService.get('app.frontendUrl')}/auth/login`,
                    });
                }
                catch (emailError) {
                    console.warn('Failed to send welcome email:', emailError);
                }
            }
            const savedUser = await this.userRepository.save(user);
            return this.mapToUserResponseDto(savedUser);
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la création de l'utilisateur: ${message}`);
        }
    }
    async generateUsername(firstName, lastName) {
        const maxLength = 50;
        const normalize = (str) => {
            return str
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase()
                .replace(/\s+/g, '')
                .replace(/[^a-z0-9]/g, '');
        };
        const normalizedFirstName = normalize(firstName);
        const normalizedLastName = normalize(lastName);
        let baseUsername;
        if (normalizedFirstName && normalizedLastName) {
            baseUsername = `${normalizedFirstName}.${normalizedLastName}`.slice(0, maxLength);
            if (baseUsername.length < 3) {
                baseUsername = `${normalizedFirstName}${normalizedLastName}`.slice(0, maxLength);
            }
        }
        else if (normalizedFirstName) {
            baseUsername = normalizedFirstName.slice(0, maxLength);
        }
        else if (normalizedLastName) {
            baseUsername = normalizedLastName.slice(0, maxLength);
        }
        else {
            throw new Error('Prénom et nom vides après normalisation');
        }
        let usernameFinal = baseUsername;
        let suffixe = 1;
        const maxAttempts = 10000;
        while (await this.usernameExists(usernameFinal)) {
            const suffixeStr = suffixe.toString();
            const availableLength = maxLength - suffixeStr.length - 1;
            if (usernameFinal.includes('.')) {
                const [firstPart, lastPart] = usernameFinal.split('.');
                usernameFinal = `${firstPart.slice(0, availableLength / 2)}.${lastPart.slice(0, availableLength / 2)}${suffixe}`;
            }
            else {
                usernameFinal = `${usernameFinal.slice(0, availableLength)}${suffixe}`;
            }
            suffixe++;
            if (suffixe > maxAttempts) {
                throw new Error(`Impossible de générer un username unique après ${maxAttempts} tentatives`);
            }
        }
        return usernameFinal;
    }
    async usernameExists(username) {
        const user = await this.userRepository.findOne({
            where: { username },
        });
        return !!user;
    }
    async updatePassword(id, newPassword) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        const hashedPassword = await utils_1.Utils.hashPassword(newPassword);
        user.password = hashedPassword;
        await this.userRepository.save(user);
    }
    async getAllUsers() {
        try {
            const users = await this.userRepository.find({
                order: { createdAt: 'DESC' },
            });
            return users.map((user) => this.mapToUserResponseDto(user));
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération des utilisateurs: ${message}`);
        }
    }
    async getUserById(id) {
        try {
            const user = await this.userRepository.findOne({
                where: { id },
            });
            if (!user) {
                throw new common_1.NotFoundException('Utilisateur non trouvé');
            }
            return this.mapToUserResponseDto(user);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération de l'utilisateur: ${message}`);
        }
    }
    async getUserByEmail(email) {
        try {
            const user = await this.userRepository.findOne({
                where: { email },
            });
            if (!user) {
                throw new common_1.NotFoundException('Utilisateur non trouvé');
            }
            return this.mapToUserResponseDto(user);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération de l'utilisateur: ${message}`);
        }
    }
    async getUserByEmailWithPassword(email) {
        try {
            const user = await this.userRepository.findOne({
                where: { email },
            });
            return user;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }
    async updateUser(id, updateUserDto) {
        try {
            const existingUser = await this.getUserById(id);
            await this.userRepository.update(id, {
                ...updateUserDto,
                updatedAt: new Date(),
            });
            const updatedUser = await this.userRepository.findOne({
                where: { id },
            });
            if (!updatedUser) {
                throw new common_1.NotFoundException('Utilisateur non trouvé après mise à jour');
            }
            return this.mapToUserResponseDto(updatedUser);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la mise à jour de l'utilisateur: ${message}`);
        }
    }
    async deleteUser(id) {
        try {
            await this.getUserById(id);
            await this.userRepository.delete(id);
            return { message: 'Utilisateur supprimé avec succès' };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la suppression de l'utilisateur: ${message}`);
        }
    }
    async deactivateUser(id) {
        return this.updateUser(id, { isActive: false });
    }
    async activateUser(id) {
        return this.updateUser(id, { isActive: true });
    }
    mapToUserResponseDto(user) {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            gender: user.gender,
            birthDate: user.birthDate,
            phone: user.phone,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, common_1.Inject)(email_service_1.EmailService)),
    __param(1, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        email_service_1.EmailService,
        config_1.ConfigService])
], UserService);
//# sourceMappingURL=user.service.js.map