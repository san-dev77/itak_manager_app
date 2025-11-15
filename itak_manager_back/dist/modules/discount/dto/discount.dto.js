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
exports.DiscountResponseDto = exports.UpdateDiscountDto = exports.CreateDiscountDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const discount_entity_1 = require("../../../entities/discount.entity");
class CreateDiscountDto {
    studentFeeId;
    type;
    description;
    amount;
    approvedBy;
}
exports.CreateDiscountDto = CreateDiscountDto;
__decorate([
    (0, class_validator_1.IsUUID)('4', { message: 'studentFeeId doit être un UUID valide' }),
    __metadata("design:type", String)
], CreateDiscountDto.prototype, "studentFeeId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(discount_entity_1.DiscountType, { message: 'Le type de réduction doit être valide' }),
    __metadata("design:type", String)
], CreateDiscountDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'La description doit être une chaîne' }),
    __metadata("design:type", String)
], CreateDiscountDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'Le montant doit être un nombre' }),
    (0, class_validator_1.Min)(0.01, { message: 'Le montant doit être supérieur à 0' }),
    __metadata("design:type", Number)
], CreateDiscountDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('4', { message: 'approvedBy doit être un UUID valide' }),
    __metadata("design:type", String)
], CreateDiscountDto.prototype, "approvedBy", void 0);
class UpdateDiscountDto extends (0, swagger_1.PartialType)(CreateDiscountDto) {
}
exports.UpdateDiscountDto = UpdateDiscountDto;
class DiscountResponseDto {
    id;
    studentFeeId;
    type;
    description;
    amount;
    approvedBy;
    createdAt;
    updatedAt;
    studentFee;
    approvedByUser;
}
exports.DiscountResponseDto = DiscountResponseDto;
//# sourceMappingURL=discount.dto.js.map