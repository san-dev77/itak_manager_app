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
exports.AssessmentResultController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const assessment_result_service_1 = require("./assessment-result.service");
const assessment_result_dto_1 = require("./dto/assessment-result.dto");
let AssessmentResultController = class AssessmentResultController {
    assessmentResultService;
    constructor(assessmentResultService) {
        this.assessmentResultService = assessmentResultService;
    }
    async create(createAssessmentResultDto) {
        return this.assessmentResultService.create(createAssessmentResultDto);
    }
    async bulkCreate(bulkCreateDto) {
        return this.assessmentResultService.bulkCreate(bulkCreateDto);
    }
    async findAll(assessmentId, studentId) {
        if (assessmentId) {
            return this.assessmentResultService.findByAssessment(assessmentId);
        }
        if (studentId) {
            return this.assessmentResultService.findByStudent(studentId);
        }
        return this.assessmentResultService.findAll();
    }
    async findOne(id) {
        return this.assessmentResultService.findOne(id);
    }
    async findByAssessment(assessmentId) {
        return this.assessmentResultService.findByAssessment(assessmentId);
    }
    async findByStudent(studentId) {
        return this.assessmentResultService.findByStudent(studentId);
    }
    async update(id, updateAssessmentResultDto) {
        return this.assessmentResultService.update(id, updateAssessmentResultDto);
    }
    async remove(id) {
        return this.assessmentResultService.remove(id);
    }
};
exports.AssessmentResultController = AssessmentResultController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Créer un nouveau résultat d'évaluation" }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Résultat créé avec succès',
        type: assessment_result_dto_1.AssessmentResultResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Données invalides ou note supérieure au maximum',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Évaluation ou étudiant non trouvé',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Un résultat existe déjà pour cet étudiant et cette évaluation',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [assessment_result_dto_1.CreateAssessmentResultDto]),
    __metadata("design:returntype", Promise)
], AssessmentResultController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('bulk'),
    (0, swagger_1.ApiOperation)({
        summary: "Créer plusieurs résultats d'évaluation en une fois",
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Résultats créés avec succès',
        type: [assessment_result_dto_1.AssessmentResultResponseDto],
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Évaluation non trouvée',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [assessment_result_dto_1.BulkCreateAssessmentResultDto]),
    __metadata("design:returntype", Promise)
], AssessmentResultController.prototype, "bulkCreate", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Récupérer tous les résultats d'évaluation" }),
    (0, swagger_1.ApiQuery)({
        name: 'assessmentId',
        required: false,
        description: "Filtrer par ID de l'évaluation",
    }),
    (0, swagger_1.ApiQuery)({
        name: 'studentId',
        required: false,
        description: "Filtrer par ID de l'étudiant",
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Liste des résultats récupérée avec succès',
        type: [assessment_result_dto_1.AssessmentResultResponseDto],
    }),
    __param(0, (0, common_1.Query)('assessmentId')),
    __param(1, (0, common_1.Query)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AssessmentResultController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer un résultat par son ID' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID du résultat',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Résultat récupéré avec succès',
        type: assessment_result_dto_1.AssessmentResultResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Résultat non trouvé',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssessmentResultController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('assessment/:assessmentId'),
    (0, swagger_1.ApiOperation)({ summary: "Récupérer les résultats d'une évaluation" }),
    (0, swagger_1.ApiParam)({
        name: 'assessmentId',
        description: "ID de l'évaluation",
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "Résultats de l'évaluation récupérés avec succès",
        type: [assessment_result_dto_1.AssessmentResultResponseDto],
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Évaluation non trouvée',
    }),
    __param(0, (0, common_1.Param)('assessmentId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssessmentResultController.prototype, "findByAssessment", null);
__decorate([
    (0, common_1.Get)('student/:studentId'),
    (0, swagger_1.ApiOperation)({ summary: "Récupérer les résultats d'un étudiant" }),
    (0, swagger_1.ApiParam)({
        name: 'studentId',
        description: "ID de l'étudiant",
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "Résultats de l'étudiant récupérés avec succès",
        type: [assessment_result_dto_1.AssessmentResultResponseDto],
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Étudiant non trouvé',
    }),
    __param(0, (0, common_1.Param)('studentId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssessmentResultController.prototype, "findByStudent", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: "Mettre à jour un résultat d'évaluation" }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID du résultat',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Résultat mis à jour avec succès',
        type: assessment_result_dto_1.AssessmentResultResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Données invalides',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Résultat non trouvé',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, assessment_result_dto_1.UpdateAssessmentResultDto]),
    __metadata("design:returntype", Promise)
], AssessmentResultController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: "Supprimer un résultat d'évaluation" }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID du résultat',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Résultat supprimé avec succès',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Résultat non trouvé',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssessmentResultController.prototype, "remove", null);
exports.AssessmentResultController = AssessmentResultController = __decorate([
    (0, swagger_1.ApiTags)('Assessment Results'),
    (0, common_1.Controller)('assessment-results'),
    __metadata("design:paramtypes", [assessment_result_service_1.AssessmentResultService])
], AssessmentResultController);
//# sourceMappingURL=assessment-result.controller.js.map