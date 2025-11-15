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
exports.InvoiceItemResponseDto = exports.UpdateInvoiceItemDto = exports.CreateInvoiceItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateInvoiceItemDto {
    invoiceId;
    studentFeeId;
    description;
    amount;
}
exports.CreateInvoiceItemDto = CreateInvoiceItemDto;
__decorate([
    (0, class_validator_1.IsUUID)('4', { message: 'invoiceId doit être un UUID valide' }),
    __metadata("design:type", String)
], CreateInvoiceItemDto.prototype, "invoiceId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('4', { message: 'studentFeeId doit être un UUID valide' }),
    __metadata("design:type", String)
], CreateInvoiceItemDto.prototype, "studentFeeId", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'La description doit être une chaîne' }),
    (0, class_validator_1.MaxLength)(255, {
        message: 'La description ne peut pas dépasser 255 caractères',
    }),
    __metadata("design:type", String)
], CreateInvoiceItemDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'Le montant doit être un nombre' }),
    (0, class_validator_1.Min)(0, { message: 'Le montant doit être positif' }),
    __metadata("design:type", Number)
], CreateInvoiceItemDto.prototype, "amount", void 0);
class UpdateInvoiceItemDto extends (0, swagger_1.PartialType)(CreateInvoiceItemDto) {
}
exports.UpdateInvoiceItemDto = UpdateInvoiceItemDto;
class InvoiceItemResponseDto {
    id;
    invoiceId;
    studentFeeId;
    description;
    amount;
    invoice;
    studentFee;
}
exports.InvoiceItemResponseDto = InvoiceItemResponseDto;
//# sourceMappingURL=invoice-item.dto.js.map