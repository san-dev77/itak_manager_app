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
exports.ClassResponseDto = exports.UpdateClassDto = exports.CreateClassDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateClassDto {
    name;
    code;
    classCategoryId;
    description;
    level;
    capacity;
    orderLevel;
}
exports.CreateClassDto = CreateClassDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Le nom de la classe doit être une chaîne' }),
    (0, class_validator_1.MinLength)(1, {
        message: 'Le nom de la classe doit contenir au moins 1 caractères',
    }),
    __metadata("design:type", String)
], CreateClassDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Le code de la classe doit être une chaîne' }),
    (0, class_validator_1.MinLength)(1, {
        message: 'Le code de la classe doit contenir au moins 1 caractères',
    }),
    __metadata("design:type", String)
], CreateClassDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('4', { message: 'La catégorie de la classe doit être une chaîne' }),
    __metadata("design:type", String)
], CreateClassDto.prototype, "classCategoryId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'La description doit être une chaîne' }),
    __metadata("design:type", String)
], CreateClassDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Le niveau doit être une chaîne' }),
    __metadata("design:type", String)
], CreateClassDto.prototype, "level", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'La capacité doit être un nombre entier' }),
    (0, class_validator_1.Min)(1, { message: 'La capacité doit être supérieure à 0' }),
    __metadata("design:type", Number)
], CreateClassDto.prototype, "capacity", void 0);
__decorate([
    (0, class_validator_1.IsInt)({ message: 'Le niveau hiérarchique doit être un nombre entier' }),
    (0, class_validator_1.Min)(1, { message: 'Le niveau hiérarchique doit être supérieur à 0' }),
    __metadata("design:type", Number)
], CreateClassDto.prototype, "orderLevel", void 0);
class UpdateClassDto extends (0, swagger_1.PartialType)(CreateClassDto) {
}
exports.UpdateClassDto = UpdateClassDto;
class ClassResponseDto {
    id;
    name;
    code;
    classCategory;
    description;
    level;
    capacity;
    orderLevel;
    createdAt;
    updatedAt;
    classSubjects;
    studentClasses;
}
exports.ClassResponseDto = ClassResponseDto;
//# sourceMappingURL=class.dto.js.map