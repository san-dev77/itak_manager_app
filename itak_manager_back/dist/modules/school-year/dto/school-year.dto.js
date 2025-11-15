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
exports.SchoolYearResponseDto = exports.UpdateSchoolYearDto = exports.CreateSchoolYearDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateSchoolYearDto {
    name;
    startDate;
    endDate;
    isActive;
}
exports.CreateSchoolYearDto = CreateSchoolYearDto;
__decorate([
    (0, class_validator_1.IsString)({ message: "Le nom de l'année scolaire doit être une chaîne" }),
    (0, class_validator_1.MinLength)(1, {
        message: "Le nom de l'année scolaire doit contenir au moins 1 caractère",
    }),
    __metadata("design:type", String)
], CreateSchoolYearDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'La date de début doit être une date valide' }),
    __metadata("design:type", String)
], CreateSchoolYearDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'La date de fin doit être une date valide' }),
    __metadata("design:type", String)
], CreateSchoolYearDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'isActive doit être un booléen' }),
    __metadata("design:type", Boolean)
], CreateSchoolYearDto.prototype, "isActive", void 0);
class UpdateSchoolYearDto extends (0, swagger_1.PartialType)(CreateSchoolYearDto) {
}
exports.UpdateSchoolYearDto = UpdateSchoolYearDto;
class SchoolYearResponseDto {
    id;
    name;
    startDate;
    endDate;
    isActive;
    createdAt;
    updatedAt;
    terms;
}
exports.SchoolYearResponseDto = SchoolYearResponseDto;
//# sourceMappingURL=school-year.dto.js.map