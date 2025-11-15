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
exports.FeeTypeResponseDto = exports.UpdateFeeTypeDto = exports.CreateFeeTypeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const fee_type_entity_1 = require("../../../entities/fee-type.entity");
class CreateFeeTypeDto {
    name;
    description;
    amountDefault;
    isRecurring;
    frequency;
}
exports.CreateFeeTypeDto = CreateFeeTypeDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Le nom doit être une chaîne' }),
    (0, class_validator_1.MinLength)(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
    __metadata("design:type", String)
], CreateFeeTypeDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'La description doit être une chaîne' }),
    __metadata("design:type", String)
], CreateFeeTypeDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'Le montant par défaut doit être un nombre' }),
    (0, class_validator_1.Min)(0, { message: 'Le montant par défaut doit être positif' }),
    __metadata("design:type", Number)
], CreateFeeTypeDto.prototype, "amountDefault", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'isRecurring doit être un booléen' }),
    __metadata("design:type", Boolean)
], CreateFeeTypeDto.prototype, "isRecurring", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(fee_type_entity_1.FeeFrequency, { message: 'La fréquence doit être une valeur valide' }),
    __metadata("design:type", String)
], CreateFeeTypeDto.prototype, "frequency", void 0);
class UpdateFeeTypeDto extends (0, swagger_1.PartialType)(CreateFeeTypeDto) {
}
exports.UpdateFeeTypeDto = UpdateFeeTypeDto;
class FeeTypeResponseDto {
    id;
    name;
    description;
    amountDefault;
    isRecurring;
    frequency;
    createdAt;
    updatedAt;
}
exports.FeeTypeResponseDto = FeeTypeResponseDto;
//# sourceMappingURL=fee-type.dto.js.map