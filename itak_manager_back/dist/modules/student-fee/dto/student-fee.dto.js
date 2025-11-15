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
exports.StudentFeesSummaryDto = exports.StudentFeeResponseDto = exports.PayStudentFeeDto = exports.UpdateStudentFeeDto = exports.CreateStudentFeeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const student_fee_entity_1 = require("../../../entities/student-fee.entity");
class CreateStudentFeeDto {
    studentId;
    feeTypeId;
    academicYearId;
    amountAssigned;
    dueDate;
    status;
}
exports.CreateStudentFeeDto = CreateStudentFeeDto;
__decorate([
    (0, class_validator_1.IsUUID)('4', { message: 'studentId doit être un UUID valide' }),
    __metadata("design:type", String)
], CreateStudentFeeDto.prototype, "studentId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('4', { message: 'feeTypeId doit être un UUID valide' }),
    __metadata("design:type", String)
], CreateStudentFeeDto.prototype, "feeTypeId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('4', { message: 'academicYearId doit être un UUID valide' }),
    __metadata("design:type", String)
], CreateStudentFeeDto.prototype, "academicYearId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'Le montant assigné doit être un nombre' }),
    (0, class_validator_1.Min)(0, { message: 'Le montant assigné doit être positif' }),
    __metadata("design:type", Number)
], CreateStudentFeeDto.prototype, "amountAssigned", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: "La date d'échéance doit être au format YYYY-MM-DD" }),
    __metadata("design:type", String)
], CreateStudentFeeDto.prototype, "dueDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(student_fee_entity_1.FeeStatus, { message: 'Le statut doit être une valeur valide' }),
    __metadata("design:type", String)
], CreateStudentFeeDto.prototype, "status", void 0);
class UpdateStudentFeeDto extends (0, swagger_1.PartialType)(CreateStudentFeeDto) {
}
exports.UpdateStudentFeeDto = UpdateStudentFeeDto;
class PayStudentFeeDto {
    paymentAmount;
}
exports.PayStudentFeeDto = PayStudentFeeDto;
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'Le montant du paiement doit être un nombre' }),
    (0, class_validator_1.Min)(0.01, { message: 'Le montant du paiement doit être supérieur à 0' }),
    __metadata("design:type", Number)
], PayStudentFeeDto.prototype, "paymentAmount", void 0);
class StudentFeeResponseDto {
    id;
    studentId;
    feeTypeId;
    academicYearId;
    amountAssigned;
    amountPaid;
    dueDate;
    status;
    createdAt;
    updatedAt;
    student;
    feeType;
}
exports.StudentFeeResponseDto = StudentFeeResponseDto;
class StudentFeesSummaryDto {
    studentId;
    totalAssigned;
    totalPaid;
    totalPending;
    totalOverdue;
    fees;
}
exports.StudentFeesSummaryDto = StudentFeesSummaryDto;
//# sourceMappingURL=student-fee.dto.js.map