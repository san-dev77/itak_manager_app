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
exports.AssessmentSubjectController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const assessment_subject_service_1 = require("./assessment-subject.service");
const assessment_subject_dto_1 = require("./dto/assessment-subject.dto");
let AssessmentSubjectController = class AssessmentSubjectController {
    assessmentSubjectService;
    constructor(assessmentSubjectService) {
        this.assessmentSubjectService = assessmentSubjectService;
    }
    async create(createDto, file, req) {
        const uploadedByUserId = req.user?.id || req.user?.sub;
        return this.assessmentSubjectService.create(createDto, file, uploadedByUserId);
    }
    async findAll(assessmentId, userId) {
        if (assessmentId) {
            return this.assessmentSubjectService.findByAssessment(assessmentId);
        }
        if (userId) {
            return this.assessmentSubjectService.findByUser(userId);
        }
        return this.assessmentSubjectService.findAll();
    }
    async findOne(id) {
        return this.assessmentSubjectService.findOne(id);
    }
    async findByAssessment(assessmentId) {
        return this.assessmentSubjectService.findByAssessment(assessmentId);
    }
    async findByUser(userId) {
        return this.assessmentSubjectService.findByUser(userId);
    }
    async update(id, updateDto, file, req) {
        const userId = req.user?.id || req.user?.sub;
        return this.assessmentSubjectService.update(id, updateDto, file, userId);
    }
    async remove(id, req) {
        const userId = req.user?.id || req.user?.sub;
        return this.assessmentSubjectService.remove(id, userId);
    }
};
exports.AssessmentSubjectController = AssessmentSubjectController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({ summary: "Créer un nouveau sujet d'évaluation avec fichier" }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        description: "Sujet d'évaluation avec fichier",
        schema: {
            type: 'object',
            properties: {
                assessmentId: {
                    type: 'string',
                    format: 'uuid',
                    description: "ID de l'évaluation",
                },
                fileType: {
                    type: 'string',
                    enum: ['pdf', 'doc', 'docx', 'odt'],
                    description: 'Type de fichier',
                },
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Fichier du sujet',
                },
            },
            required: ['assessmentId', 'fileType', 'file'],
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Sujet créé avec succès',
        type: assessment_subject_dto_1.AssessmentSubjectResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Données invalides ou type de fichier incorrect',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Évaluation ou utilisateur non trouvé',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [assessment_subject_dto_1.CreateAssessmentSubjectDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AssessmentSubjectController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Récupérer tous les sujets d'évaluation" }),
    (0, swagger_1.ApiQuery)({
        name: 'assessmentId',
        required: false,
        description: "Filtrer par ID de l'évaluation",
    }),
    (0, swagger_1.ApiQuery)({
        name: 'userId',
        required: false,
        description: "Filtrer par ID de l'utilisateur",
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Liste des sujets récupérée avec succès',
        type: [assessment_subject_dto_1.AssessmentSubjectResponseDto],
    }),
    __param(0, (0, common_1.Query)('assessmentId')),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AssessmentSubjectController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer un sujet par son ID' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID du sujet',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Sujet récupéré avec succès',
        type: assessment_subject_dto_1.AssessmentSubjectResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Sujet non trouvé',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssessmentSubjectController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('assessment/:assessmentId'),
    (0, swagger_1.ApiOperation)({ summary: "Récupérer les sujets d'une évaluation" }),
    (0, swagger_1.ApiParam)({
        name: 'assessmentId',
        description: "ID de l'évaluation",
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "Sujets de l'évaluation récupérés avec succès",
        type: [assessment_subject_dto_1.AssessmentSubjectResponseDto],
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Évaluation non trouvée',
    }),
    __param(0, (0, common_1.Param)('assessmentId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssessmentSubjectController.prototype, "findByAssessment", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer les sujets uploadés par un utilisateur' }),
    (0, swagger_1.ApiParam)({
        name: 'userId',
        description: "ID de l'utilisateur",
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "Sujets de l'utilisateur récupérés avec succès",
        type: [assessment_subject_dto_1.AssessmentSubjectResponseDto],
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Utilisateur non trouvé',
    }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssessmentSubjectController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({ summary: "Mettre à jour un sujet d'évaluation" }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID du sujet',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiBody)({
        description: 'Mise à jour du sujet (optionnel avec nouveau fichier)',
        schema: {
            type: 'object',
            properties: {
                fileType: {
                    type: 'string',
                    enum: ['pdf', 'doc', 'docx', 'odt'],
                    description: 'Type de fichier',
                },
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Nouveau fichier (optionnel)',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Sujet mis à jour avec succès',
        type: assessment_subject_dto_1.AssessmentSubjectResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Données invalides',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Sujet non trouvé',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: "Seul l'uploadeur peut modifier le fichier",
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, assessment_subject_dto_1.UpdateAssessmentSubjectDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AssessmentSubjectController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: "Supprimer un sujet d'évaluation" }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID du sujet',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Sujet supprimé avec succès',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Sujet non trouvé',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: "Seul l'uploadeur peut supprimer le fichier",
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AssessmentSubjectController.prototype, "remove", null);
exports.AssessmentSubjectController = AssessmentSubjectController = __decorate([
    (0, swagger_1.ApiTags)('Assessment Subjects'),
    (0, common_1.Controller)('assessment-subjects'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [assessment_subject_service_1.AssessmentSubjectService])
], AssessmentSubjectController);
//# sourceMappingURL=assessment-subject.controller.js.map