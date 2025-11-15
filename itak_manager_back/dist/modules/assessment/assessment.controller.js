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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const assessment_service_1 = require("./assessment.service");
const assessment_dto_1 = require("./dto/assessment.dto");
let AssessmentController = class AssessmentController {
    assessmentService;
    constructor(assessmentService) {
        this.assessmentService = assessmentService;
    }
    async create(createAssessmentDto) {
        return this.assessmentService.create(createAssessmentDto);
    }
    async findAll(termId, classSubjectId, classId) {
        if (termId) {
            return this.assessmentService.findByTerm(termId);
        }
        if (classSubjectId) {
            return this.assessmentService.findByClassSubject(classSubjectId);
        }
        if (classId) {
            return this.assessmentService.findByClass(classId);
        }
        return this.assessmentService.findAll();
    }
    async findOne(id) {
        return this.assessmentService.findOne(id);
    }
    async findByTerm(termId) {
        return this.assessmentService.findByTerm(termId);
    }
    async findByClassSubject(classSubjectId) {
        return this.assessmentService.findByClassSubject(classSubjectId);
    }
    async findByClass(classId) {
        return this.assessmentService.findByClass(classId);
    }
    async update(id, updateAssessmentDto) {
        return this.assessmentService.update(id, updateAssessmentDto);
    }
    async remove(id) {
        return this.assessmentService.remove(id);
    }
};
exports.AssessmentController = AssessmentController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une nouvelle évaluation' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Évaluation créée avec succès',
        type: assessment_dto_1.AssessmentResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Données invalides ou trimestre inactif',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Trimestre ou matière de classe non trouvé',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Une évaluation avec le même titre existe déjà',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [assessment_dto_1.CreateAssessmentDto]),
    __metadata("design:returntype", Promise)
], AssessmentController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer toutes les évaluations' }),
    (0, swagger_1.ApiQuery)({
        name: 'termId',
        required: false,
        description: 'Filtrer par ID du trimestre',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'classSubjectId',
        required: false,
        description: 'Filtrer par ID de la matière de classe',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'classId',
        required: false,
        description: 'Filtrer par ID de la classe',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Liste des évaluations récupérée avec succès',
        type: [assessment_dto_1.AssessmentResponseDto],
    }),
    __param(0, (0, common_1.Query)('termId')),
    __param(1, (0, common_1.Query)('classSubjectId')),
    __param(2, (0, common_1.Query)('classId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AssessmentController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer une évaluation par son ID' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: "ID de l'évaluation",
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Évaluation récupérée avec succès',
        type: assessment_dto_1.AssessmentResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Évaluation non trouvée',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssessmentController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('term/:termId'),
    (0, swagger_1.ApiOperation)({ summary: "Récupérer les évaluations d'un trimestre" }),
    (0, swagger_1.ApiParam)({
        name: 'termId',
        description: 'ID du trimestre',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Évaluations du trimestre récupérées avec succès',
        type: [assessment_dto_1.AssessmentResponseDto],
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Trimestre non trouvé',
    }),
    __param(0, (0, common_1.Param)('termId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssessmentController.prototype, "findByTerm", null);
__decorate([
    (0, common_1.Get)('class-subject/:classSubjectId'),
    (0, swagger_1.ApiOperation)({
        summary: "Récupérer les évaluations d'une matière de classe",
    }),
    (0, swagger_1.ApiParam)({
        name: 'classSubjectId',
        description: 'ID de la matière de classe',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Évaluations de la matière récupérées avec succès',
        type: [assessment_dto_1.AssessmentResponseDto],
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Matière de classe non trouvée',
    }),
    __param(0, (0, common_1.Param)('classSubjectId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssessmentController.prototype, "findByClassSubject", null);
__decorate([
    (0, common_1.Get)('class/:classId'),
    (0, swagger_1.ApiOperation)({ summary: "Récupérer les évaluations d'une classe" }),
    (0, swagger_1.ApiParam)({
        name: 'classId',
        description: 'ID de la classe',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Évaluations de la classe récupérées avec succès',
        type: [assessment_dto_1.AssessmentResponseDto],
    }),
    __param(0, (0, common_1.Param)('classId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssessmentController.prototype, "findByClass", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour une évaluation' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: "ID de l'évaluation",
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Évaluation mise à jour avec succès',
        type: assessment_dto_1.AssessmentResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Données invalides',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Évaluation non trouvée',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Une évaluation avec le même titre existe déjà',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, assessment_dto_1.UpdateAssessmentDto]),
    __metadata("design:returntype", Promise)
], AssessmentController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer une évaluation' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: "ID de l'évaluation",
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Évaluation supprimée avec succès',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Évaluation non trouvée',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssessmentController.prototype, "remove", null);
exports.AssessmentController = AssessmentController = __decorate([
    (0, swagger_1.ApiTags)('Assessments'),
    (0, common_1.Controller)('assessments'),
    __metadata("design:paramtypes", [assessment_service_1.AssessmentService])
], AssessmentController);
//# sourceMappingURL=assessment.controller.js.map