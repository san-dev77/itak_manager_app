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
exports.NextClassResponseDto = exports.PromotionResponseDto = exports.BulkPromotionDto = exports.CreatePromotionDto = void 0;
const class_validator_1 = require("class-validator");
class CreatePromotionDto {
    studentId;
    toClassId;
    year;
    remarks;
}
exports.CreatePromotionDto = CreatePromotionDto;
__decorate([
    (0, class_validator_1.IsUUID)('4', { message: "L'ID de l'étudiant doit être un UUID valide" }),
    __metadata("design:type", String)
], CreatePromotionDto.prototype, "studentId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('4', {
        message: "L'ID de la classe de destination doit être un UUID valide",
    }),
    __metadata("design:type", String)
], CreatePromotionDto.prototype, "toClassId", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: "L'année scolaire doit être une chaîne" }),
    __metadata("design:type", String)
], CreatePromotionDto.prototype, "year", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Les remarques doivent être une chaîne' }),
    __metadata("design:type", String)
], CreatePromotionDto.prototype, "remarks", void 0);
class BulkPromotionDto {
    fromClassId;
    toClassId;
    year;
    remarks;
}
exports.BulkPromotionDto = BulkPromotionDto;
__decorate([
    (0, class_validator_1.IsUUID)('4', { message: "L'ID de la classe source doit être un UUID valide" }),
    __metadata("design:type", String)
], BulkPromotionDto.prototype, "fromClassId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('4', {
        message: "L'ID de la classe de destination doit être un UUID valide",
    }),
    __metadata("design:type", String)
], BulkPromotionDto.prototype, "toClassId", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: "L'année scolaire doit être une chaîne" }),
    __metadata("design:type", String)
], BulkPromotionDto.prototype, "year", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Les remarques doivent être une chaîne' }),
    __metadata("design:type", String)
], BulkPromotionDto.prototype, "remarks", void 0);
class PromotionResponseDto {
    student;
    fromClass;
    toClass;
    year;
    remarks;
    createdAt;
}
exports.PromotionResponseDto = PromotionResponseDto;
class NextClassResponseDto {
    currentClass;
    nextClass;
    canPromote;
    message;
}
exports.NextClassResponseDto = NextClassResponseDto;
//# sourceMappingURL=promotion.dto.js.map