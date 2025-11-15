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
exports.BulkCreateAssessmentResultDto = exports.AssessmentResultResponseDto = exports.UpdateAssessmentResultDto = exports.CreateAssessmentResultDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const assessment_result_entity_1 = require("../../../entities/assessment-result.entity");
class CreateAssessmentResultDto {
    assessmentId;
    studentId;
    score;
    remarks;
    status = assessment_result_entity_1.AssessmentResultStatus.PRESENT;
}
exports.CreateAssessmentResultDto = CreateAssessmentResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "ID de l'évaluation" }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAssessmentResultDto.prototype, "assessmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "ID de l'étudiant" }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAssessmentResultDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Note obtenue', minimum: 0 }),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateAssessmentResultDto.prototype, "score", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Remarques sur la performance' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAssessmentResultDto.prototype, "remarks", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Statut de présence de l'étudiant",
        enum: assessment_result_entity_1.AssessmentResultStatus,
        default: assessment_result_entity_1.AssessmentResultStatus.PRESENT,
    }),
    (0, class_validator_1.IsEnum)(assessment_result_entity_1.AssessmentResultStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAssessmentResultDto.prototype, "status", void 0);
class UpdateAssessmentResultDto {
    score;
    remarks;
    status;
}
exports.UpdateAssessmentResultDto = UpdateAssessmentResultDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Note obtenue', minimum: 0 }),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateAssessmentResultDto.prototype, "score", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Remarques sur la performance' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateAssessmentResultDto.prototype, "remarks", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Statut de présence de l'étudiant",
        enum: assessment_result_entity_1.AssessmentResultStatus,
    }),
    (0, class_validator_1.IsEnum)(assessment_result_entity_1.AssessmentResultStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateAssessmentResultDto.prototype, "status", void 0);
class AssessmentResultResponseDto {
    id;
    assessmentId;
    assessmentTitle;
    assessmentMaxScore;
    studentId;
    studentName;
    studentMatricule;
    score;
    percentage;
    remarks;
    status;
    createdAt;
    updatedAt;
}
exports.AssessmentResultResponseDto = AssessmentResultResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID du résultat' }),
    __metadata("design:type", String)
], AssessmentResultResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "ID de l'évaluation" }),
    __metadata("design:type", String)
], AssessmentResultResponseDto.prototype, "assessmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Titre de l'évaluation" }),
    __metadata("design:type", String)
], AssessmentResultResponseDto.prototype, "assessmentTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Note maximale de l'évaluation" }),
    __metadata("design:type", Number)
], AssessmentResultResponseDto.prototype, "assessmentMaxScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "ID de l'étudiant" }),
    __metadata("design:type", String)
], AssessmentResultResponseDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Nom complet de l'étudiant" }),
    __metadata("design:type", String)
], AssessmentResultResponseDto.prototype, "studentName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Matricule de l'étudiant" }),
    __metadata("design:type", String)
], AssessmentResultResponseDto.prototype, "studentMatricule", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Note obtenue' }),
    __metadata("design:type", Number)
], AssessmentResultResponseDto.prototype, "score", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Pourcentage obtenu' }),
    __metadata("design:type", Number)
], AssessmentResultResponseDto.prototype, "percentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Remarques sur la performance' }),
    __metadata("design:type", String)
], AssessmentResultResponseDto.prototype, "remarks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Statut de présence de l'étudiant",
        enum: assessment_result_entity_1.AssessmentResultStatus,
    }),
    __metadata("design:type", String)
], AssessmentResultResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date de création' }),
    __metadata("design:type", Date)
], AssessmentResultResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date de mise à jour' }),
    __metadata("design:type", Date)
], AssessmentResultResponseDto.prototype, "updatedAt", void 0);
class BulkCreateAssessmentResultDto {
    assessmentId;
    results;
}
exports.BulkCreateAssessmentResultDto = BulkCreateAssessmentResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "ID de l'évaluation" }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], BulkCreateAssessmentResultDto.prototype, "assessmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Liste des résultats à créer',
        type: [CreateAssessmentResultDto],
    }),
    __metadata("design:type", Array)
], BulkCreateAssessmentResultDto.prototype, "results", void 0);
//# sourceMappingURL=assessment-result.dto.js.map