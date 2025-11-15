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
exports.TeacherResponseDto = exports.UpdateTeacherDto = exports.CreateTeacherDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateTeacherDto {
    userId;
    matricule;
    hireDate;
    photo;
    maritalStatus;
    subjectIds;
    diplomas;
    address;
    emergencyContact;
    notes;
}
exports.CreateTeacherDto = CreateTeacherDto;
__decorate([
    (0, class_validator_1.IsUUID)('4', { message: 'userId doit être un UUID valide' }),
    __metadata("design:type", String)
], CreateTeacherDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Le matricule doit être une chaîne' }),
    (0, class_validator_1.MinLength)(3, { message: 'Le matricule doit contenir au moins 3 caractères' }),
    __metadata("design:type", String)
], CreateTeacherDto.prototype, "matricule", void 0);
__decorate([
    (0, class_validator_1.IsString)({
        message: "La date d'embauche doit être une chaîne au format YYYY-MM-DD",
    }),
    (0, class_validator_1.IsDateString)({}, { message: "La date d'embauche doit être au format YYYY-MM-DD" }),
    __metadata("design:type", String)
], CreateTeacherDto.prototype, "hireDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'La photo doit être une chaîne' }),
    __metadata("design:type", String)
], CreateTeacherDto.prototype, "photo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Le statut marital doit être une chaîne' }),
    __metadata("design:type", String)
], CreateTeacherDto.prototype, "maritalStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Les matières doivent être un tableau' }),
    (0, class_validator_1.IsUUID)('4', {
        each: true,
        message: 'Chaque matière doit être un UUID valide',
    }),
    __metadata("design:type", Array)
], CreateTeacherDto.prototype, "subjectIds", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Les diplômes doivent être une chaîne' }),
    __metadata("design:type", String)
], CreateTeacherDto.prototype, "diplomas", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: "L'adresse doit être une chaîne" }),
    __metadata("design:type", String)
], CreateTeacherDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: "Le contact d'urgence doit être une chaîne" }),
    __metadata("design:type", String)
], CreateTeacherDto.prototype, "emergencyContact", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Les notes doivent être une chaîne' }),
    __metadata("design:type", String)
], CreateTeacherDto.prototype, "notes", void 0);
class UpdateTeacherDto extends (0, swagger_1.PartialType)(CreateTeacherDto) {
}
exports.UpdateTeacherDto = UpdateTeacherDto;
class TeacherResponseDto {
    id;
    matricule;
    hireDate;
    photo;
    maritalStatus;
    subjects;
    diplomas;
    address;
    emergencyContact;
    notes;
    createdAt;
    updatedAt;
    user;
}
exports.TeacherResponseDto = TeacherResponseDto;
//# sourceMappingURL=teacher.dto.js.map