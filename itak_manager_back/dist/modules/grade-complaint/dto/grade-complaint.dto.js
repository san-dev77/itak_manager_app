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
exports.GradeComplaintHistoryResponseDto = exports.GradeComplaintResponseDto = exports.UpdateGradeComplaintStatusDto = exports.CreateGradeComplaintDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const grade_complaint_entity_1 = require("../../../entities/grade-complaint.entity");
class CreateGradeComplaintDto {
    studentId;
    assessmentId;
    reason;
}
exports.CreateGradeComplaintDto = CreateGradeComplaintDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "ID de l'étudiant" }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateGradeComplaintDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "ID de l'évaluation" }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateGradeComplaintDto.prototype, "assessmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Motif de la réclamation', minLength: 10 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(10, 1000),
    __metadata("design:type", String)
], CreateGradeComplaintDto.prototype, "reason", void 0);
class UpdateGradeComplaintStatusDto {
    status;
    comment;
    newScore;
}
exports.UpdateGradeComplaintStatusDto = UpdateGradeComplaintStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nouveau statut de la réclamation',
        enum: grade_complaint_entity_1.ComplaintStatus,
    }),
    (0, class_validator_1.IsEnum)(grade_complaint_entity_1.ComplaintStatus),
    __metadata("design:type", String)
], UpdateGradeComplaintStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Commentaire sur le changement de statut',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateGradeComplaintStatusDto.prototype, "comment", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Nouvelle note (si approuvée)',
        minimum: 0,
    }),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateGradeComplaintStatusDto.prototype, "newScore", void 0);
class GradeComplaintResponseDto {
    id;
    studentId;
    studentName;
    studentMatricule;
    assessmentId;
    assessmentTitle;
    currentScore;
    maxScore;
    status;
    reason;
    createdAt;
    updatedAt;
}
exports.GradeComplaintResponseDto = GradeComplaintResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID de la réclamation' }),
    __metadata("design:type", String)
], GradeComplaintResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "ID de l'étudiant" }),
    __metadata("design:type", String)
], GradeComplaintResponseDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Nom complet de l'étudiant" }),
    __metadata("design:type", String)
], GradeComplaintResponseDto.prototype, "studentName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Matricule de l'étudiant" }),
    __metadata("design:type", String)
], GradeComplaintResponseDto.prototype, "studentMatricule", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "ID de l'évaluation" }),
    __metadata("design:type", String)
], GradeComplaintResponseDto.prototype, "assessmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Titre de l'évaluation" }),
    __metadata("design:type", String)
], GradeComplaintResponseDto.prototype, "assessmentTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Note actuelle' }),
    __metadata("design:type", Number)
], GradeComplaintResponseDto.prototype, "currentScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Note maximale de l'évaluation" }),
    __metadata("design:type", Number)
], GradeComplaintResponseDto.prototype, "maxScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Statut de la réclamation',
        enum: grade_complaint_entity_1.ComplaintStatus,
    }),
    __metadata("design:type", String)
], GradeComplaintResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Motif de la réclamation' }),
    __metadata("design:type", String)
], GradeComplaintResponseDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date de création' }),
    __metadata("design:type", Date)
], GradeComplaintResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date de mise à jour' }),
    __metadata("design:type", Date)
], GradeComplaintResponseDto.prototype, "updatedAt", void 0);
class GradeComplaintHistoryResponseDto {
    id;
    complaintId;
    oldScore;
    newScore;
    changedBy;
    changedByName;
    changedAt;
    comment;
}
exports.GradeComplaintHistoryResponseDto = GradeComplaintHistoryResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "ID de l'historique" }),
    __metadata("design:type", String)
], GradeComplaintHistoryResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID de la réclamation' }),
    __metadata("design:type", String)
], GradeComplaintHistoryResponseDto.prototype, "complaintId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Ancienne note' }),
    __metadata("design:type", Number)
], GradeComplaintHistoryResponseDto.prototype, "oldScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nouvelle note' }),
    __metadata("design:type", Number)
], GradeComplaintHistoryResponseDto.prototype, "newScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "ID de l'utilisateur qui a effectué le changement",
    }),
    __metadata("design:type", String)
], GradeComplaintHistoryResponseDto.prototype, "changedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Nom de l'utilisateur qui a effectué le changement",
    }),
    __metadata("design:type", String)
], GradeComplaintHistoryResponseDto.prototype, "changedByName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date du changement' }),
    __metadata("design:type", Date)
], GradeComplaintHistoryResponseDto.prototype, "changedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Commentaire sur le changement' }),
    __metadata("design:type", String)
], GradeComplaintHistoryResponseDto.prototype, "comment", void 0);
//# sourceMappingURL=grade-complaint.dto.js.map