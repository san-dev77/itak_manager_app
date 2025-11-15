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
exports.CreateStudentTransferDto = void 0;
const class_validator_1 = require("class-validator");
const student_transfer_entity_1 = require("../../../entities/student-transfer.entity");
class CreateStudentTransferDto {
    studentId;
    fromClassId;
    toClassId;
    transferDate;
    reason;
    reasonDetails;
    year;
    approvedBy;
}
exports.CreateStudentTransferDto = CreateStudentTransferDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateStudentTransferDto.prototype, "studentId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateStudentTransferDto.prototype, "fromClassId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateStudentTransferDto.prototype, "toClassId", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateStudentTransferDto.prototype, "transferDate", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(student_transfer_entity_1.TransferReason),
    __metadata("design:type", String)
], CreateStudentTransferDto.prototype, "reason", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateStudentTransferDto.prototype, "reasonDetails", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(9),
    __metadata("design:type", String)
], CreateStudentTransferDto.prototype, "year", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateStudentTransferDto.prototype, "approvedBy", void 0);
//# sourceMappingURL=create-student-transfer.dto.js.map