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
exports.TeachingAssignmentResponseDto = exports.UpdateTeachingAssignmentDto = exports.CreateTeachingAssignmentDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateTeachingAssignmentDto {
    teacherId;
    classSubjectId;
    startDate;
    endDate;
}
exports.CreateTeachingAssignmentDto = CreateTeachingAssignmentDto;
__decorate([
    (0, class_validator_1.IsUUID)('4', {
        message: "L'ID du professeur doit être un UUID valide",
    }),
    __metadata("design:type", String)
], CreateTeachingAssignmentDto.prototype, "teacherId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('4', {
        message: "L'ID de la classe-matière doit être un UUID valide",
    }),
    __metadata("design:type", String)
], CreateTeachingAssignmentDto.prototype, "classSubjectId", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'La date de début doit être une date valide' }),
    __metadata("design:type", Object)
], CreateTeachingAssignmentDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'La date de fin doit être une date valide' }),
    __metadata("design:type", Object)
], CreateTeachingAssignmentDto.prototype, "endDate", void 0);
class UpdateTeachingAssignmentDto extends (0, swagger_1.PartialType)(CreateTeachingAssignmentDto) {
}
exports.UpdateTeachingAssignmentDto = UpdateTeachingAssignmentDto;
class TeachingAssignmentResponseDto {
    id;
    startDate;
    endDate;
    teacher;
    classSubject;
    coefficient;
    class;
    subject;
    createdAt;
    updatedAt;
}
exports.TeachingAssignmentResponseDto = TeachingAssignmentResponseDto;
//# sourceMappingURL=teaching-assignment.dto.js.map