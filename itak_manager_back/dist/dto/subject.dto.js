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
exports.UpdateSubjectDto = exports.CreateSubjectDto = void 0;
const class_validator_1 = require("class-validator");
class CreateSubjectDto {
    name;
    code;
    categorie_id;
}
exports.CreateSubjectDto = CreateSubjectDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Le nom de la matière doit être une chaîne' }),
    (0, class_validator_1.MinLength)(2, {
        message: 'Le nom de la matière doit contenir au moins 2 caractères',
    }),
    __metadata("design:type", String)
], CreateSubjectDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Le code doit être une chaîne' }),
    (0, class_validator_1.MinLength)(2, { message: 'Le code doit contenir au moins 2 caractères' }),
    __metadata("design:type", String)
], CreateSubjectDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: "L'ID de la catégorie doit être un nombre" }),
    __metadata("design:type", Number)
], CreateSubjectDto.prototype, "categorie_id", void 0);
class UpdateSubjectDto {
    name;
    code;
    categorie_id;
}
exports.UpdateSubjectDto = UpdateSubjectDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Le nom de la matière doit être une chaîne' }),
    (0, class_validator_1.MinLength)(2, {
        message: 'Le nom de la matière doit contenir au moins 2 caractères',
    }),
    __metadata("design:type", String)
], UpdateSubjectDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Le code doit être une chaîne' }),
    (0, class_validator_1.MinLength)(2, { message: 'Le code doit contenir au moins 2 caractères' }),
    __metadata("design:type", String)
], UpdateSubjectDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: "L'ID de la catégorie doit être un nombre" }),
    __metadata("design:type", Number)
], UpdateSubjectDto.prototype, "categorie_id", void 0);
//# sourceMappingURL=subject.dto.js.map