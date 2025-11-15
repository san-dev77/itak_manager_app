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
exports.StudentResponseDto = exports.UpdateStudentDto = exports.CreateStudentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateStudentDto {
    userId;
    matricule;
    enrollmentDate;
    photo;
    maritalStatus;
    fatherName;
    motherName;
    tutorName;
    tutorPhone;
    address;
    emergencyContact;
    notes;
}
exports.CreateStudentDto = CreateStudentDto;
__decorate([
    (0, class_validator_1.IsUUID)('4', { message: 'userId doit être un UUID valide' }),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Le matricule doit être une chaîne' }),
    (0, class_validator_1.MinLength)(3, { message: 'Le matricule doit contenir au moins 3 caractères' }),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "matricule", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: "La date d'inscription doit être au format YYYY-MM-DD" }),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "enrollmentDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'La photo doit être une chaîne' }),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "photo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Le statut marital doit être une chaîne' }),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "maritalStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Le nom du père doit être une chaîne' }),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "fatherName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Le nom de la mère doit être une chaîne' }),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "motherName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Le nom du tuteur doit être une chaîne' }),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "tutorName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Le téléphone du tuteur doit être une chaîne' }),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "tutorPhone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: "L'adresse doit être une chaîne" }),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: "Le contact d'urgence doit être une chaîne" }),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "emergencyContact", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Les notes doivent être une chaîne' }),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "notes", void 0);
class UpdateStudentDto extends (0, swagger_1.PartialType)(CreateStudentDto) {
}
exports.UpdateStudentDto = UpdateStudentDto;
class StudentResponseDto {
    id;
    userId;
    matricule;
    enrollmentDate;
    photo;
    maritalStatus;
    fatherName;
    motherName;
    tutorName;
    tutorPhone;
    address;
    emergencyContact;
    notes;
    createdAt;
    updatedAt;
    user;
}
exports.StudentResponseDto = StudentResponseDto;
//# sourceMappingURL=student.dto.js.map