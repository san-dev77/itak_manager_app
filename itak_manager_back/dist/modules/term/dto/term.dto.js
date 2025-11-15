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
exports.TermResponseDto = exports.UpdateTermDto = exports.CreateTermDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateTermDto {
    schoolYearId;
    name;
    startDate;
    endDate;
    isActive;
    orderNumber;
}
exports.CreateTermDto = CreateTermDto;
__decorate([
    (0, class_validator_1.IsUUID)('4', { message: "L'ID de l'année scolaire doit être un UUID valide" }),
    __metadata("design:type", String)
], CreateTermDto.prototype, "schoolYearId", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Le nom du trimestre doit être une chaîne' }),
    (0, class_validator_1.MinLength)(1, {
        message: 'Le nom du trimestre doit contenir au moins 1 caractère',
    }),
    __metadata("design:type", String)
], CreateTermDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'La date de début doit être une date valide' }),
    __metadata("design:type", String)
], CreateTermDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'La date de fin doit être une date valide' }),
    __metadata("design:type", String)
], CreateTermDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'isActive doit être un booléen' }),
    __metadata("design:type", Boolean)
], CreateTermDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: "Le numéro d'ordre doit être un nombre entier" }),
    (0, class_validator_1.Min)(1, { message: "Le numéro d'ordre doit être supérieur à 0" }),
    __metadata("design:type", Number)
], CreateTermDto.prototype, "orderNumber", void 0);
class UpdateTermDto extends (0, swagger_1.PartialType)(CreateTermDto) {
}
exports.UpdateTermDto = UpdateTermDto;
class TermResponseDto {
    id;
    schoolYearId;
    name;
    startDate;
    endDate;
    isActive;
    orderNumber;
    createdAt;
    updatedAt;
    schoolYear;
}
exports.TermResponseDto = TermResponseDto;
//# sourceMappingURL=term.dto.js.map