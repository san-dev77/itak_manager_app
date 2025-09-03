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
exports.UpdateClassSubjectDto = exports.CreateClassSubjectDto = void 0;
const class_validator_1 = require("class-validator");
class CreateClassSubjectDto {
    class_id;
    subject_id;
    coefficient;
    weekly_hours;
    is_optional;
}
exports.CreateClassSubjectDto = CreateClassSubjectDto;
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: "L'ID de la classe doit être un nombre" }),
    __metadata("design:type", Number)
], CreateClassSubjectDto.prototype, "class_id", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: "L'ID de la matière doit être un nombre" }),
    __metadata("design:type", Number)
], CreateClassSubjectDto.prototype, "subject_id", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'Le coefficient doit être un nombre' }),
    (0, class_validator_1.Min)(0, { message: 'Le coefficient doit être au moins 0' }),
    (0, class_validator_1.Max)(10, { message: 'Le coefficient ne peut pas dépasser 10' }),
    __metadata("design:type", Number)
], CreateClassSubjectDto.prototype, "coefficient", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Les heures hebdomadaires doivent être un nombre' }),
    (0, class_validator_1.Min)(0, { message: 'Les heures hebdomadaires doivent être au moins 0' }),
    (0, class_validator_1.Max)(40, { message: 'Les heures hebdomadaires ne peuvent pas dépasser 40' }),
    __metadata("design:type", Number)
], CreateClassSubjectDto.prototype, "weekly_hours", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'Le statut optionnel doit être un booléen' }),
    __metadata("design:type", Boolean)
], CreateClassSubjectDto.prototype, "is_optional", void 0);
class UpdateClassSubjectDto {
    class_id;
    subject_id;
    coefficient;
    weekly_hours;
    is_optional;
}
exports.UpdateClassSubjectDto = UpdateClassSubjectDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: "L'ID de la classe doit être un nombre" }),
    __metadata("design:type", Number)
], UpdateClassSubjectDto.prototype, "class_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: "L'ID de la matière doit être un nombre" }),
    __metadata("design:type", Number)
], UpdateClassSubjectDto.prototype, "subject_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Le coefficient doit être un nombre' }),
    (0, class_validator_1.Min)(0, { message: 'Le coefficient doit être au moins 0' }),
    (0, class_validator_1.Max)(10, { message: 'Le coefficient ne peut pas dépasser 10' }),
    __metadata("design:type", Number)
], UpdateClassSubjectDto.prototype, "coefficient", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Les heures hebdomadaires doivent être un nombre' }),
    (0, class_validator_1.Min)(0, { message: 'Les heures hebdomadaires doivent être au moins 0' }),
    (0, class_validator_1.Max)(40, { message: 'Les heures hebdomadaires ne peuvent pas dépasser 40' }),
    __metadata("design:type", Number)
], UpdateClassSubjectDto.prototype, "weekly_hours", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'Le statut optionnel doit être un booléen' }),
    __metadata("design:type", Boolean)
], UpdateClassSubjectDto.prototype, "is_optional", void 0);
//# sourceMappingURL=class-subject.dto.js.map