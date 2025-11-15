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
exports.StudentParentResponseDto = exports.CreateStudentParentDto = exports.ParentResponseDto = exports.UpdateParentDto = exports.CreateParentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const student_parent_entity_1 = require("../../../entities/student-parent.entity");
class CreateParentDto {
    userId;
    job;
}
exports.CreateParentDto = CreateParentDto;
__decorate([
    (0, class_validator_1.IsUUID)('4', { message: 'userId doit être un UUID valide' }),
    __metadata("design:type", String)
], CreateParentDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'La profession doit être une chaîne' }),
    (0, class_validator_1.MinLength)(2, {
        message: 'La profession doit contenir au moins 2 caractères',
    }),
    __metadata("design:type", String)
], CreateParentDto.prototype, "job", void 0);
class UpdateParentDto extends (0, swagger_1.PartialType)(CreateParentDto) {
}
exports.UpdateParentDto = UpdateParentDto;
class ParentResponseDto {
    id;
    job;
    createdAt;
    updatedAt;
    user;
}
exports.ParentResponseDto = ParentResponseDto;
class CreateStudentParentDto {
    studentId;
    parentId;
    relationship;
}
exports.CreateStudentParentDto = CreateStudentParentDto;
__decorate([
    (0, class_validator_1.IsUUID)('4', { message: 'studentId doit être un UUID valide' }),
    __metadata("design:type", String)
], CreateStudentParentDto.prototype, "studentId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('4', { message: 'parentId doit être un UUID valide' }),
    __metadata("design:type", String)
], CreateStudentParentDto.prototype, "parentId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(student_parent_entity_1.RelationshipType, {
        message: 'Le type de relation doit être valide',
    }),
    __metadata("design:type", String)
], CreateStudentParentDto.prototype, "relationship", void 0);
class StudentParentResponseDto {
    id;
    studentId;
    parentId;
    relationship;
    createdAt;
    updatedAt;
}
exports.StudentParentResponseDto = StudentParentResponseDto;
//# sourceMappingURL=parent.dto.js.map