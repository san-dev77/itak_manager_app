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
exports.UpdateStudentDto = exports.CreateStudentDto = void 0;
const class_validator_1 = require("class-validator");
class CreateStudentDto {
    user_id;
    matricule;
    enrollment_date;
    photo;
    marital_status;
    father_name;
    mother_name;
    tutor_name;
    tutor_phone;
    address;
    emergency_contact;
    notes;
}
exports.CreateStudentDto = CreateStudentDto;
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'user_id doit être un nombre' }),
    __metadata("design:type", Number)
], CreateStudentDto.prototype, "user_id", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Le matricule doit être une chaîne' }),
    (0, class_validator_1.MinLength)(3, { message: 'Le matricule doit contenir au moins 3 caractères' }),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "matricule", void 0);
__decorate([
    (0, class_validator_1.IsString)({
        message: "La date d'inscription doit être une chaîne au format YYYY-MM-DD",
    }),
    (0, class_validator_1.IsDateString)({}, { message: "La date d'inscription doit être au format YYYY-MM-DD" }),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "enrollment_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'La photo doit être une chaîne' }),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "photo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Le statut marital doit être une chaîne' }),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "marital_status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Le nom du père doit être une chaîne' }),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "father_name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Le nom de la mère doit être une chaîne' }),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "mother_name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Le nom du tuteur doit être une chaîne' }),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "tutor_name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Le téléphone du tuteur doit être une chaîne' }),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "tutor_phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: "L'adresse doit être une chaîne" }),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: "Le contact d'urgence doit être une chaîne" }),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "emergency_contact", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Les notes doivent être une chaîne' }),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "notes", void 0);
class UpdateStudentDto {
    matricule;
    enrollment_date;
    photo;
    marital_status;
    father_name;
    mother_name;
    tutor_name;
    tutor_phone;
    address;
    emergency_contact;
    notes;
}
exports.UpdateStudentDto = UpdateStudentDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Le matricule doit être une chaîne' }),
    (0, class_validator_1.MinLength)(3, { message: 'Le matricule doit contenir au moins 3 caractères' }),
    __metadata("design:type", String)
], UpdateStudentDto.prototype, "matricule", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({
        message: "La date d'inscription doit être une chaîne au format YYYY-MM-DD",
    }),
    (0, class_validator_1.IsDateString)({}, { message: "La date d'inscription doit être au format YYYY-MM-DD" }),
    __metadata("design:type", String)
], UpdateStudentDto.prototype, "enrollment_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'La photo doit être une chaîne' }),
    __metadata("design:type", String)
], UpdateStudentDto.prototype, "photo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Le statut marital doit être une chaîne' }),
    __metadata("design:type", String)
], UpdateStudentDto.prototype, "marital_status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Le nom du père doit être une chaîne' }),
    __metadata("design:type", String)
], UpdateStudentDto.prototype, "father_name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Le nom de la mère doit être une chaîne' }),
    __metadata("design:type", String)
], UpdateStudentDto.prototype, "mother_name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Le nom du tuteur doit être une chaîne' }),
    __metadata("design:type", String)
], UpdateStudentDto.prototype, "tutor_name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Le téléphone du tuteur doit être une chaîne' }),
    __metadata("design:type", String)
], UpdateStudentDto.prototype, "tutor_phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: "L'adresse doit être une chaîne" }),
    __metadata("design:type", String)
], UpdateStudentDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: "Le contact d'urgence doit être une chaîne" }),
    __metadata("design:type", String)
], UpdateStudentDto.prototype, "emergency_contact", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Les notes doivent être une chaîne' }),
    __metadata("design:type", String)
], UpdateStudentDto.prototype, "notes", void 0);
//# sourceMappingURL=student.dto.js.map