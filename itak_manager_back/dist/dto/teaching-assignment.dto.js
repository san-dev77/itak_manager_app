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
exports.UpdateTeachingAssignmentDto = exports.CreateTeachingAssignmentDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateTeachingAssignmentDto {
    teacher_id;
    class_subject_id;
    start_date;
    end_date;
}
exports.CreateTeachingAssignmentDto = CreateTeachingAssignmentDto;
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: "L'ID du professeur doit être un nombre" }),
    __metadata("design:type", Number)
], CreateTeachingAssignmentDto.prototype, "teacher_id", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: "L'ID de la classe-matière doit être un nombre" }),
    __metadata("design:type", Number)
], CreateTeachingAssignmentDto.prototype, "class_subject_id", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => String),
    (0, class_validator_1.IsDateString)({}, { message: 'La date de début doit être une date valide' }),
    __metadata("design:type", Object)
], CreateTeachingAssignmentDto.prototype, "start_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => String),
    (0, class_validator_1.IsDateString)({}, { message: 'La date de fin doit être une date valide' }),
    __metadata("design:type", Object)
], CreateTeachingAssignmentDto.prototype, "end_date", void 0);
class UpdateTeachingAssignmentDto {
    teacher_id;
    class_subject_id;
    start_date;
    end_date;
}
exports.UpdateTeachingAssignmentDto = UpdateTeachingAssignmentDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: "L'ID du professeur doit être un nombre" }),
    __metadata("design:type", Number)
], UpdateTeachingAssignmentDto.prototype, "teacher_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: "L'ID de la classe-matière doit être un nombre" }),
    __metadata("design:type", Number)
], UpdateTeachingAssignmentDto.prototype, "class_subject_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => String),
    (0, class_validator_1.IsDateString)({}, { message: 'La date de début doit être une date valide' }),
    __metadata("design:type", Object)
], UpdateTeachingAssignmentDto.prototype, "start_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => String),
    (0, class_validator_1.IsDateString)({}, { message: 'La date de fin doit être une date valide' }),
    __metadata("design:type", Object)
], UpdateTeachingAssignmentDto.prototype, "end_date", void 0);
//# sourceMappingURL=teaching-assignment.dto.js.map