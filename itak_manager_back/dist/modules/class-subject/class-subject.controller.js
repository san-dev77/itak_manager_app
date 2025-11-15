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
exports.ClassSubjectController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_subject_service_1 = require("./class-subject.service");
const class_subject_dto_1 = require("./dto/class-subject.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let ClassSubjectController = class ClassSubjectController {
    classSubjectService;
    constructor(classSubjectService) {
        this.classSubjectService = classSubjectService;
    }
    async create(createClassSubjectDto) {
        return await this.classSubjectService.createClassSubject(createClassSubjectDto);
    }
    async findAll() {
        return await this.classSubjectService.getAllClassSubjects();
    }
    async findByClass(classId) {
        return await this.classSubjectService.getClassSubjectsByClass(classId);
    }
    async findBySubject(subjectId) {
        return await this.classSubjectService.getClassSubjectsBySubject(subjectId);
    }
    async findOne(id) {
        return await this.classSubjectService.getClassSubjectById(id);
    }
    async update(id, updateClassSubjectDto) {
        return await this.classSubjectService.updateClassSubject(id, updateClassSubjectDto);
    }
    async remove(id) {
        return await this.classSubjectService.deleteClassSubject(id);
    }
};
exports.ClassSubjectController = ClassSubjectController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une nouvelle association classe-matière' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Association créée avec succès',
        type: class_subject_dto_1.ClassSubjectResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Classe ou matière non trouvée',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Cette association existe déjà',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [class_subject_dto_1.CreateClassSubjectDto]),
    __metadata("design:returntype", Promise)
], ClassSubjectController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer toutes les associations classe-matière' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Liste des associations',
        type: [class_subject_dto_1.ClassSubjectResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClassSubjectController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('class/:classId'),
    (0, swagger_1.ApiOperation)({ summary: "Récupérer les matières d'une classe" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Matières de la classe',
        type: [class_subject_dto_1.ClassSubjectResponseDto],
    }),
    __param(0, (0, common_1.Param)('classId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClassSubjectController.prototype, "findByClass", null);
__decorate([
    (0, common_1.Get)('subject/:subjectId'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer les classes pour une matière' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Classes enseignant cette matière',
        type: [class_subject_dto_1.ClassSubjectResponseDto],
    }),
    __param(0, (0, common_1.Param)('subjectId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClassSubjectController.prototype, "findBySubject", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer une association par ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Association trouvée',
        type: class_subject_dto_1.ClassSubjectResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Association non trouvée',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClassSubjectController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour une association classe-matière' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Association mise à jour avec succès',
        type: class_subject_dto_1.ClassSubjectResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Association non trouvée',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, class_subject_dto_1.UpdateClassSubjectDto]),
    __metadata("design:returntype", Promise)
], ClassSubjectController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer une association classe-matière' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Association supprimée avec succès',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Association non trouvée',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClassSubjectController.prototype, "remove", null);
exports.ClassSubjectController = ClassSubjectController = __decorate([
    (0, swagger_1.ApiTags)('class-subjects'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('class-subjects'),
    __metadata("design:paramtypes", [class_subject_service_1.ClassSubjectService])
], ClassSubjectController);
//# sourceMappingURL=class-subject.controller.js.map