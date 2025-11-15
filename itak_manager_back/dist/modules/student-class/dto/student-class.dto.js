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
exports.StudentClassResponseDto = exports.UpdateStudentClassDto = exports.CreateStudentClassDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class CreateStudentClassDto {
    studentId;
    classId;
    startDate;
    endDate;
}
exports.CreateStudentClassDto = CreateStudentClassDto;
__decorate([
    (0, class_validator_1.IsUUID)('4', { message: "L'ID de l'étudiant doit être un UUID" }),
    __metadata("design:type", String)
], CreateStudentClassDto.prototype, "studentId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('4', { message: "L'ID de la classe doit être un UUID" }),
    __metadata("design:type", String)
], CreateStudentClassDto.prototype, "classId", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => String),
    (0, class_validator_1.IsDateString)({}, { message: 'La date de début doit être une date valide' }),
    __metadata("design:type", Object)
], CreateStudentClassDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => String),
    (0, class_validator_1.IsDateString)({}, { message: 'La date de fin doit être une date valide' }),
    __metadata("design:type", Object)
], CreateStudentClassDto.prototype, "endDate", void 0);
class UpdateStudentClassDto extends (0, swagger_1.PartialType)(CreateStudentClassDto) {
}
exports.UpdateStudentClassDto = UpdateStudentClassDto;
class StudentClassResponseDto {
    id;
    studentId;
    classId;
    startDate;
    endDate;
    year;
    createdAt;
    updatedAt;
    student;
    class;
}
exports.StudentClassResponseDto = StudentClassResponseDto;
//# sourceMappingURL=student-class.dto.js.map