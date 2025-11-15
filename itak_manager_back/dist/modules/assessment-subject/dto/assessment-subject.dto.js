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
exports.AssessmentSubjectResponseDto = exports.UpdateAssessmentSubjectDto = exports.CreateAssessmentSubjectDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const assessment_subject_entity_1 = require("../../../entities/assessment-subject.entity");
class CreateAssessmentSubjectDto {
    assessmentId;
    fileType;
}
exports.CreateAssessmentSubjectDto = CreateAssessmentSubjectDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "ID de l'évaluation" }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAssessmentSubjectDto.prototype, "assessmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type de fichier',
        enum: assessment_subject_entity_1.FileType,
    }),
    (0, class_validator_1.IsEnum)(assessment_subject_entity_1.FileType),
    __metadata("design:type", String)
], CreateAssessmentSubjectDto.prototype, "fileType", void 0);
class UpdateAssessmentSubjectDto {
    fileType;
}
exports.UpdateAssessmentSubjectDto = UpdateAssessmentSubjectDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Type de fichier',
        enum: assessment_subject_entity_1.FileType,
    }),
    (0, class_validator_1.IsEnum)(assessment_subject_entity_1.FileType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateAssessmentSubjectDto.prototype, "fileType", void 0);
class AssessmentSubjectResponseDto {
    id;
    assessmentId;
    assessmentTitle;
    fileUrl;
    fileType;
    uploadedBy;
    uploadedByName;
    originalFileName;
    fileSize;
    createdAt;
    updatedAt;
}
exports.AssessmentSubjectResponseDto = AssessmentSubjectResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID du sujet' }),
    __metadata("design:type", String)
], AssessmentSubjectResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "ID de l'évaluation" }),
    __metadata("design:type", String)
], AssessmentSubjectResponseDto.prototype, "assessmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Titre de l'évaluation" }),
    __metadata("design:type", String)
], AssessmentSubjectResponseDto.prototype, "assessmentTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'URL du fichier' }),
    __metadata("design:type", String)
], AssessmentSubjectResponseDto.prototype, "fileUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type de fichier',
        enum: assessment_subject_entity_1.FileType,
    }),
    __metadata("design:type", String)
], AssessmentSubjectResponseDto.prototype, "fileType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "ID de l'utilisateur qui a uploadé" }),
    __metadata("design:type", String)
], AssessmentSubjectResponseDto.prototype, "uploadedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Nom de l'utilisateur qui a uploadé" }),
    __metadata("design:type", String)
], AssessmentSubjectResponseDto.prototype, "uploadedByName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nom original du fichier' }),
    __metadata("design:type", String)
], AssessmentSubjectResponseDto.prototype, "originalFileName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Taille du fichier en octets' }),
    __metadata("design:type", Number)
], AssessmentSubjectResponseDto.prototype, "fileSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date de création' }),
    __metadata("design:type", Date)
], AssessmentSubjectResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date de mise à jour' }),
    __metadata("design:type", Date)
], AssessmentSubjectResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=assessment-subject.dto.js.map