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
exports.StaffResponseDto = exports.UpdateStaffDto = exports.CreateStaffDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateStaffDto {
    userId;
    matricule;
    hireDate;
    position;
    photo;
    maritalStatus;
    address;
    emergencyContact;
    notes;
}
exports.CreateStaffDto = CreateStaffDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'userId doit être une chaîne' }),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "userId", void 0);
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
], CreateStaffDto.prototype, "hireDate", void 0);
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
], CreateStaffDto.prototype, "maritalStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: "L'adresse doit être une chaîne" }),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: "Le contact d'urgence doit être une chaîne" }),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "emergencyContact", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Les notes doivent être une chaîne' }),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "notes", void 0);
class UpdateStaffDto extends (0, swagger_1.PartialType)(CreateStaffDto) {
}
exports.UpdateStaffDto = UpdateStaffDto;
class StaffResponseDto {
    id;
    userId;
    matricule;
    hireDate;
    position;
    photo;
    maritalStatus;
    address;
    emergencyContact;
    notes;
    createdAt;
    updatedAt;
    user;
}
exports.StaffResponseDto = StaffResponseDto;
//# sourceMappingURL=staff.dto.js.map