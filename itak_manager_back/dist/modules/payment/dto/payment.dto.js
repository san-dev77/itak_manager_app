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
exports.PaymentSummaryDto = exports.PaymentResponseDto = exports.UpdatePaymentDto = exports.CreatePaymentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const payment_entity_1 = require("../../../entities/payment.entity");
class CreatePaymentDto {
    studentFeeId;
    paymentDate;
    amount;
    method;
    provider;
    transactionRef;
    receivedBy;
    status;
}
exports.CreatePaymentDto = CreatePaymentDto;
__decorate([
    (0, class_validator_1.IsUUID)('4', { message: 'studentFeeId doit être un UUID valide' }),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "studentFeeId", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'La date de paiement doit être valide' }),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "paymentDate", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'Le montant doit être un nombre' }),
    (0, class_validator_1.Min)(0.01, { message: 'Le montant doit être supérieur à 0' }),
    __metadata("design:type", Number)
], CreatePaymentDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(payment_entity_1.PaymentMethod, { message: 'La méthode de paiement doit être valide' }),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "method", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Le fournisseur doit être une chaîne' }),
    (0, class_validator_1.MaxLength)(50, {
        message: 'Le fournisseur ne peut pas dépasser 50 caractères',
    }),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "provider", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'La référence de transaction doit être une chaîne' }),
    (0, class_validator_1.MaxLength)(100, {
        message: 'La référence de transaction ne peut pas dépasser 100 caractères',
    }),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "transactionRef", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('4', { message: 'receivedBy doit être un UUID valide' }),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "receivedBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(payment_entity_1.PaymentStatus, { message: 'Le statut doit être valide' }),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "status", void 0);
class UpdatePaymentDto extends (0, swagger_1.PartialType)(CreatePaymentDto) {
}
exports.UpdatePaymentDto = UpdatePaymentDto;
class PaymentResponseDto {
    id;
    studentFeeId;
    paymentDate;
    amount;
    method;
    provider;
    transactionRef;
    receivedBy;
    status;
    createdAt;
    updatedAt;
    studentFee;
    receivedByUser;
}
exports.PaymentResponseDto = PaymentResponseDto;
class PaymentSummaryDto {
    totalAmount;
    totalPayments;
    paymentsByMethod;
    paymentsByStatus;
}
exports.PaymentSummaryDto = PaymentSummaryDto;
//# sourceMappingURL=payment.dto.js.map