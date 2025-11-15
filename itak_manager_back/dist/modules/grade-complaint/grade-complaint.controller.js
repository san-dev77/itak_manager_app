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
exports.GradeComplaintController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const grade_complaint_service_1 = require("./grade-complaint.service");
const grade_complaint_dto_1 = require("./dto/grade-complaint.dto");
let GradeComplaintController = class GradeComplaintController {
    gradeComplaintService;
    constructor(gradeComplaintService) {
        this.gradeComplaintService = gradeComplaintService;
    }
    async create(createGradeComplaintDto) {
        return this.gradeComplaintService.create(createGradeComplaintDto);
    }
    async findAll(studentId, assessmentId) {
        if (studentId) {
            return this.gradeComplaintService.findByStudent(studentId);
        }
        if (assessmentId) {
            return this.gradeComplaintService.findByAssessment(assessmentId);
        }
        return this.gradeComplaintService.findAll();
    }
    async findOne(id) {
        return this.gradeComplaintService.findOne(id);
    }
    async findByStudent(studentId) {
        return this.gradeComplaintService.findByStudent(studentId);
    }
    async findByAssessment(assessmentId) {
        return this.gradeComplaintService.findByAssessment(assessmentId);
    }
    async getHistory(id) {
        return this.gradeComplaintService.getHistory(id);
    }
    async updateStatus(id, updateStatusDto, req) {
        const changedByUserId = req.user?.id || req.user?.sub;
        return this.gradeComplaintService.updateStatus(id, updateStatusDto, changedByUserId);
    }
    async remove(id) {
        return this.gradeComplaintService.remove(id);
    }
};
exports.GradeComplaintController = GradeComplaintController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une nouvelle réclamation de note' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Réclamation créée avec succès',
        type: grade_complaint_dto_1.GradeComplaintResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Données invalides ou aucun résultat trouvé',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Étudiant ou évaluation non trouvé',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Une réclamation existe déjà pour cet étudiant et cette évaluation',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [grade_complaint_dto_1.CreateGradeComplaintDto]),
    __metadata("design:returntype", Promise)
], GradeComplaintController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer toutes les réclamations de notes' }),
    (0, swagger_1.ApiQuery)({
        name: 'studentId',
        required: false,
        description: "Filtrer par ID de l'étudiant",
    }),
    (0, swagger_1.ApiQuery)({
        name: 'assessmentId',
        required: false,
        description: "Filtrer par ID de l'évaluation",
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Liste des réclamations récupérée avec succès',
        type: [grade_complaint_dto_1.GradeComplaintResponseDto],
    }),
    __param(0, (0, common_1.Query)('studentId')),
    __param(1, (0, common_1.Query)('assessmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GradeComplaintController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer une réclamation par son ID' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID de la réclamation',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Réclamation récupérée avec succès',
        type: grade_complaint_dto_1.GradeComplaintResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Réclamation non trouvée',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GradeComplaintController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('student/:studentId'),
    (0, swagger_1.ApiOperation)({ summary: "Récupérer les réclamations d'un étudiant" }),
    (0, swagger_1.ApiParam)({
        name: 'studentId',
        description: "ID de l'étudiant",
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "Réclamations de l'étudiant récupérées avec succès",
        type: [grade_complaint_dto_1.GradeComplaintResponseDto],
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Étudiant non trouvé',
    }),
    __param(0, (0, common_1.Param)('studentId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GradeComplaintController.prototype, "findByStudent", null);
__decorate([
    (0, common_1.Get)('assessment/:assessmentId'),
    (0, swagger_1.ApiOperation)({ summary: "Récupérer les réclamations d'une évaluation" }),
    (0, swagger_1.ApiParam)({
        name: 'assessmentId',
        description: "ID de l'évaluation",
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "Réclamations de l'évaluation récupérées avec succès",
        type: [grade_complaint_dto_1.GradeComplaintResponseDto],
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Évaluation non trouvée',
    }),
    __param(0, (0, common_1.Param)('assessmentId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GradeComplaintController.prototype, "findByAssessment", null);
__decorate([
    (0, common_1.Get)(':id/history'),
    (0, swagger_1.ApiOperation)({ summary: "Récupérer l'historique d'une réclamation" }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID de la réclamation',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Historique récupéré avec succès',
        type: [grade_complaint_dto_1.GradeComplaintHistoryResponseDto],
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Réclamation non trouvée',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GradeComplaintController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: "Mettre à jour le statut d'une réclamation" }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID de la réclamation',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Statut mis à jour avec succès',
        type: grade_complaint_dto_1.GradeComplaintResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Données invalides ou réclamation déjà traitée',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Réclamation non trouvée',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, grade_complaint_dto_1.UpdateGradeComplaintStatusDto, Object]),
    __metadata("design:returntype", Promise)
], GradeComplaintController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer une réclamation' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID de la réclamation',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Réclamation supprimée avec succès',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Réclamation non trouvée',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'Les réclamations traitées ne peuvent pas être supprimées',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GradeComplaintController.prototype, "remove", null);
exports.GradeComplaintController = GradeComplaintController = __decorate([
    (0, swagger_1.ApiTags)('Grade Complaints'),
    (0, common_1.Controller)('grade-complaints'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [grade_complaint_service_1.GradeComplaintService])
], GradeComplaintController);
//# sourceMappingURL=grade-complaint.controller.js.map