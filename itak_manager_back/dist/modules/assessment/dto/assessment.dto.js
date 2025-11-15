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
exports.AssessmentResponseDto = exports.UpdateAssessmentDto = exports.CreateAssessmentDto = exports.AssessmentType = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var AssessmentType;
(function (AssessmentType) {
    AssessmentType["EXAM"] = "exam";
    AssessmentType["HOMEWORK"] = "homework";
    AssessmentType["SUPERVISED_HOMEWORK"] = "supervised_homework";
    AssessmentType["TEST"] = "test";
    AssessmentType["QUIZ"] = "quiz";
    AssessmentType["MONTHLY_COMPOSITION"] = "monthly_composition";
    AssessmentType["CONTINUOUS_ASSESSMENT"] = "continuous_assessment";
})(AssessmentType || (exports.AssessmentType = AssessmentType = {}));
class CreateAssessmentDto {
    termId;
    classSubjectId;
    type = AssessmentType.EXAM;
    title;
    description;
    startDate;
    endDate;
    maxScore = 20;
    weight = 1;
}
exports.CreateAssessmentDto = CreateAssessmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID du trimestre' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAssessmentDto.prototype, "termId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID de la matière de classe' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAssessmentDto.prototype, "classSubjectId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Type d'évaluation",
        enum: AssessmentType,
        default: AssessmentType.EXAM,
    }),
    (0, class_validator_1.IsEnum)(AssessmentType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAssessmentDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Titre de l'évaluation", maxLength: 100 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 100),
    __metadata("design:type", String)
], CreateAssessmentDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Description de l'évaluation" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAssessmentDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Date de début de l'évaluation (YYYY-MM-DD)" }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateAssessmentDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Date de fin de l'évaluation (YYYY-MM-DD)" }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateAssessmentDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Note maximale', default: 20, minimum: 0.01 }),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0.01),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateAssessmentDto.prototype, "maxScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Coefficient de l'évaluation",
        default: 1,
        minimum: 0.01,
        maximum: 10,
    }),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0.01),
    (0, class_validator_1.Max)(10),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateAssessmentDto.prototype, "weight", void 0);
class UpdateAssessmentDto extends (0, swagger_1.PartialType)(CreateAssessmentDto) {
}
exports.UpdateAssessmentDto = UpdateAssessmentDto;
class AssessmentResponseDto {
    id;
    termId;
    termName;
    classSubjectId;
    className;
    subjectName;
    type;
    title;
    description;
    startDate;
    endDate;
    maxScore;
    weight;
    createdAt;
    updatedAt;
}
exports.AssessmentResponseDto = AssessmentResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "ID de l'évaluation" }),
    __metadata("design:type", String)
], AssessmentResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID du trimestre' }),
    __metadata("design:type", String)
], AssessmentResponseDto.prototype, "termId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nom du trimestre' }),
    __metadata("design:type", String)
], AssessmentResponseDto.prototype, "termName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID de la matière de classe' }),
    __metadata("design:type", String)
], AssessmentResponseDto.prototype, "classSubjectId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nom de la classe' }),
    __metadata("design:type", String)
], AssessmentResponseDto.prototype, "className", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nom de la matière' }),
    __metadata("design:type", String)
], AssessmentResponseDto.prototype, "subjectName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Type d'évaluation",
        enum: AssessmentType,
    }),
    __metadata("design:type", String)
], AssessmentResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Titre de l'évaluation" }),
    __metadata("design:type", String)
], AssessmentResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Description de l'évaluation" }),
    __metadata("design:type", String)
], AssessmentResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Date de début de l'évaluation" }),
    __metadata("design:type", Date)
], AssessmentResponseDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Date de fin de l'évaluation" }),
    __metadata("design:type", Date)
], AssessmentResponseDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Note maximale' }),
    __metadata("design:type", Number)
], AssessmentResponseDto.prototype, "maxScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Coefficient de l'évaluation" }),
    __metadata("design:type", Number)
], AssessmentResponseDto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date de création' }),
    __metadata("design:type", Date)
], AssessmentResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date de mise à jour' }),
    __metadata("design:type", Date)
], AssessmentResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=assessment.dto.js.map