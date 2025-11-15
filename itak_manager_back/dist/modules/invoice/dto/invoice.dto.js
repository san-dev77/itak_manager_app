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
exports.InvoiceResponseDto = exports.UpdateInvoiceDto = exports.CreateInvoiceDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const invoice_entity_1 = require("../../../entities/invoice.entity");
class CreateInvoiceDto {
    studentId;
    invoiceNumber;
    totalAmount;
    status;
    issuedDate;
    dueDate;
}
exports.CreateInvoiceDto = CreateInvoiceDto;
__decorate([
    (0, class_validator_1.IsUUID)('4', { message: 'studentId doit être un UUID valide' }),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "studentId", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Le numéro de facture doit être une chaîne' }),
    (0, class_validator_1.MaxLength)(50, {
        message: 'Le numéro de facture ne peut pas dépasser 50 caractères',
    }),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "invoiceNumber", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'Le montant total doit être un nombre' }),
    (0, class_validator_1.Min)(0, { message: 'Le montant total doit être positif' }),
    __metadata("design:type", Number)
], CreateInvoiceDto.prototype, "totalAmount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(invoice_entity_1.InvoiceStatus, { message: 'Le statut doit être valide' }),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: "La date d'émission doit être valide" }),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "issuedDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: "La date d'échéance doit être valide" }),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "dueDate", void 0);
class UpdateInvoiceDto extends (0, swagger_1.PartialType)(CreateInvoiceDto) {
}
exports.UpdateInvoiceDto = UpdateInvoiceDto;
class InvoiceResponseDto {
    id;
    studentId;
    invoiceNumber;
    totalAmount;
    status;
    issuedDate;
    dueDate;
    createdAt;
    updatedAt;
    student;
    items;
}
exports.InvoiceResponseDto = InvoiceResponseDto;
//# sourceMappingURL=invoice.dto.js.map