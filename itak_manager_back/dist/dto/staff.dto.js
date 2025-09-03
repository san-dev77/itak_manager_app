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
exports.UpdateStaffDto = exports.CreateStaffDto = void 0;
const class_validator_1 = require("class-validator");
class CreateStaffDto {
    user_id;
    matricule;
    hire_date;
    position;
    photo;
    marital_status;
    address;
    emergency_contact;
    notes;
}
exports.CreateStaffDto = CreateStaffDto;
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'user_id doit être un nombre' }),
    __metadata("design:type", Number)
], CreateStaffDto.prototype, "user_id", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Le matricule doit être une chaîne' }),
    (0, class_validator_1.MinLength)(3, { message: 'Le matricule doit contenir au moins 3 caractères' }),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "matricule", void 0);
__decorate([
    (0, class_validator_1.IsString)({
        message: "La date d'embauche doit être une chaîne au format YYYY-MM-DD",
    }),
    (0, class_validator_1.IsDateString)({}, { message: "La date d'embauche doit être au format YYYY-MM-DD" }),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "hire_date", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Le poste doit être une chaîne' }),
    (0, class_validator_1.MinLength)(2, { message: 'Le poste doit contenir au moins 2 caractères' }),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "position", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'La photo doit être une chaîne' }),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "photo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Le statut marital doit être une chaîne' }),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "marital_status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: "L'adresse doit être une chaîne" }),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: "Le contact d'urgence doit être une chaîne" }),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "emergency_contact", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Les notes doivent être une chaîne' }),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "notes", void 0);
class UpdateStaffDto {
    matricule;
    hire_date;
    position;
    photo;
    marital_status;
    address;
    emergency_contact;
    notes;
}
exports.UpdateStaffDto = UpdateStaffDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Le matricule doit être une chaîne' }),
    (0, class_validator_1.MinLength)(3, { message: 'Le matricule doit contenir au moins 3 caractères' }),
    __metadata("design:type", String)
], UpdateStaffDto.prototype, "matricule", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({
        message: "La date d'embauche doit être une chaîne au format YYYY-MM-DD",
    }),
    (0, class_validator_1.IsDateString)({}, { message: "La date d'embauche doit être au format YYYY-MM-DD" }),
    __metadata("design:type", String)
], UpdateStaffDto.prototype, "hire_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Le poste doit être une chaîne' }),
    (0, class_validator_1.MinLength)(2, { message: 'Le poste doit contenir au moins 2 caractères' }),
    __metadata("design:type", String)
], UpdateStaffDto.prototype, "position", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'La photo doit être une chaîne' }),
    __metadata("design:type", String)
], UpdateStaffDto.prototype, "photo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Le statut marital doit être une chaîne' }),
    __metadata("design:type", String)
], UpdateStaffDto.prototype, "marital_status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: "L'adresse doit être une chaîne" }),
    __metadata("design:type", String)
], UpdateStaffDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: "Le contact d'urgence doit être une chaîne" }),
    __metadata("design:type", String)
], UpdateStaffDto.prototype, "emergency_contact", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Les notes doivent être une chaîne' }),
    __metadata("design:type", String)
], UpdateStaffDto.prototype, "notes", void 0);
//# sourceMappingURL=staff.dto.js.map