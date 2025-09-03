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
exports.UpdateClassDto = exports.CreateClassDto = void 0;
const class_validator_1 = require("class-validator");
class CreateClassDto {
    name;
    level;
    capacity;
    categorie_id;
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
    (0, class_validator_1.IsString)({ message: 'Le niveau doit être une chaîne' }),
    (0, class_validator_1.MinLength)(1, { message: 'Le niveau doit contenir au moins 1 caractères' }),
    __metadata("design:type", String)
], CreateClassDto.prototype, "level", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'La capacité doit être un nombre' }),
    (0, class_validator_1.Min)(1, { message: 'La capacité doit être au moins 1' }),
    __metadata("design:type", Number)
], CreateClassDto.prototype, "capacity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: "L'ID de la catégorie doit être un nombre" }),
    __metadata("design:type", Number)
], CreateClassDto.prototype, "categorie_id", void 0);
class UpdateClassDto {
    name;
    level;
    capacity;
    categorie_id;
}
exports.UpdateClassDto = UpdateClassDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Le nom de la classe doit être une chaîne' }),
    (0, class_validator_1.MinLength)(2, {
        message: 'Le nom de la classe doit contenir au moins 2 caractères',
    }),
    __metadata("design:type", String)
], UpdateClassDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Le niveau doit être une chaîne' }),
    (0, class_validator_1.MinLength)(2, { message: 'Le niveau doit contenir au moins 2 caractères' }),
    __metadata("design:type", String)
], UpdateClassDto.prototype, "level", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'La capacité doit être un nombre' }),
    (0, class_validator_1.Min)(1, { message: 'La capacité doit être au moins 1' }),
    __metadata("design:type", Number)
], UpdateClassDto.prototype, "capacity", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: "L'ID de la catégorie doit être un nombre" }),
    __metadata("design:type", Number)
], UpdateClassDto.prototype, "categorie_id", void 0);
//# sourceMappingURL=class.dto.js.map