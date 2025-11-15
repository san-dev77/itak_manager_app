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
exports.RegisterDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../../../entities/user.entity");
class RegisterDto {
    username;
    email;
    password;
    firstName;
    lastName;
    role;
    gender;
    birthDate;
    phone;
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Nom d'utilisateur unique",
        example: 'johndoe',
        minLength: 3,
    }),
    (0, class_validator_1.IsString)({ message: "Le nom d'utilisateur doit être une chaîne" }),
    (0, class_validator_1.MinLength)(3, {
        message: "Le nom d'utilisateur doit contenir au moins 3 caractères",
    }),
    __metadata("design:type", String)
], RegisterDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Adresse email unique',
        example: 'john.doe@itak.com',
    }),
    (0, class_validator_1.IsEmail)({}, { message: 'Email invalide' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Mot de passe sécurisé',
        example: 'motdepasse123',
        minLength: 6,
    }),
    (0, class_validator_1.IsString)({ message: 'Le mot de passe doit être une chaîne' }),
    (0, class_validator_1.MinLength)(6, {
        message: 'Le mot de passe doit contenir au moins 6 caractères',
    }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Prénom de l'utilisateur",
        example: 'John',
    }),
    (0, class_validator_1.IsString)({ message: 'Le prénom doit être une chaîne' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Nom de famille de l'utilisateur",
        example: 'Doe',
    }),
    (0, class_validator_1.IsString)({ message: 'Le nom doit être une chaîne' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Rôle de l'utilisateur dans le système",
        example: user_entity_1.UserRole.STUDENT,
        enum: user_entity_1.UserRole,
    }),
    (0, class_validator_1.IsEnum)(user_entity_1.UserRole, { message: 'Le rôle doit être valide' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: `Genre de l'utilisateur`,
        example: 'Masculin',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Le genre doit être une chaîne' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: `Date de naissance de l'utilisateur`,
        example: '1990-01-01',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'La date de naissance doit être une date valide' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "birthDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Numéro de téléphone (optionnel)',
        example: '+221 77 123 45 67',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Le téléphone doit être une chaîne' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "phone", void 0);
//# sourceMappingURL=register.dto.js.map