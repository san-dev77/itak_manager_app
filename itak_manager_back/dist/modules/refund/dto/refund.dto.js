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
exports.RefundSummaryDto = exports.RefundResponseDto = exports.UpdateRefundDto = exports.CreateRefundDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateRefundDto {
    paymentId;
    amount;
    reason;
    processedBy;
}
exports.CreateRefundDto = CreateRefundDto;
__decorate([
    (0, class_validator_1.IsUUID)('4', { message: 'paymentId doit être un UUID valide' }),
    __metadata("design:type", String)
], CreateRefundDto.prototype, "paymentId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'Le montant doit être un nombre' }),
    (0, class_validator_1.Min)(0.01, { message: 'Le montant doit être supérieur à 0' }),
    __metadata("design:type", Number)
], CreateRefundDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'La raison doit être une chaîne' }),
    __metadata("design:type", String)
], CreateRefundDto.prototype, "reason", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('4', { message: 'processedBy doit être un UUID valide' }),
    __metadata("design:type", String)
], CreateRefundDto.prototype, "processedBy", void 0);
class UpdateRefundDto extends (0, swagger_1.PartialType)(CreateRefundDto) {
}
exports.UpdateRefundDto = UpdateRefundDto;
class RefundResponseDto {
    id;
    paymentId;
    amount;
    reason;
    processedBy;
    createdAt;
    updatedAt;
    payment;
    processedByUser;
}
exports.RefundResponseDto = RefundResponseDto;
class RefundSummaryDto {
    totalAmount;
    totalRefunds;
    refundsByMonth;
}
exports.RefundSummaryDto = RefundSummaryDto;
//# sourceMappingURL=refund.dto.js.map