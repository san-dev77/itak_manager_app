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
exports.TeachingAssignmentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const teaching_assignment_service_1 = require("./teaching-assignment.service");
const teaching_assignment_dto_1 = require("./dto/teaching-assignment.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let TeachingAssignmentController = class TeachingAssignmentController {
    teachingAssignmentService;
    constructor(teachingAssignmentService) {
        this.teachingAssignmentService = teachingAssignmentService;
    }
    async create(createTeachingAssignmentDto) {
        return await this.teachingAssignmentService.createTeachingAssignment(createTeachingAssignmentDto);
    }
    async findAll() {
        return await this.teachingAssignmentService.getAllTeachingAssignments();
    }
    async findByTeacher(teacherId) {
        return await this.teachingAssignmentService.getTeachingAssignmentsByTeacher(teacherId);
    }
    async findByClassSubject(classSubjectId) {
        return await this.teachingAssignmentService.getTeachingAssignmentsByClassSubject(classSubjectId);
    }
    async findOne(id) {
        return await this.teachingAssignmentService.getTeachingAssignmentById(id);
    }
    async update(id, updateTeachingAssignmentDto) {
        return await this.teachingAssignmentService.updateTeachingAssignment(id, updateTeachingAssignmentDto);
    }
    async remove(id) {
        return await this.teachingAssignmentService.deleteTeachingAssignment(id);
    }
};
exports.TeachingAssignmentController = TeachingAssignmentController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Créer une nouvelle affectation d'enseignement" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Affectation créée avec succès',
        type: teaching_assignment_dto_1.TeachingAssignmentResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Professeur ou association classe-matière non trouvé(e)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Ce professeur est déjà affecté à cette classe-matière',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [teaching_assignment_dto_1.CreateTeachingAssignmentDto]),
    __metadata("design:returntype", Promise)
], TeachingAssignmentController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Récupérer toutes les affectations d'enseignement" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Liste des affectations',
        type: [teaching_assignment_dto_1.TeachingAssignmentResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TeachingAssignmentController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('teacher/:teacherId'),
    (0, swagger_1.ApiOperation)({ summary: "Récupérer les affectations d'un professeur" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Affectations du professeur',
        type: [teaching_assignment_dto_1.TeachingAssignmentResponseDto],
    }),
    __param(0, (0, common_1.Param)('teacherId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeachingAssignmentController.prototype, "findByTeacher", null);
__decorate([
    (0, common_1.Get)('class-subject/:classSubjectId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer les affectations pour une association classe-matière',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Affectations pour la classe-matière',
        type: [teaching_assignment_dto_1.TeachingAssignmentResponseDto],
    }),
    __param(0, (0, common_1.Param)('classSubjectId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeachingAssignmentController.prototype, "findByClassSubject", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer une affectation par ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Affectation trouvée',
        type: teaching_assignment_dto_1.TeachingAssignmentResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Affectation non trouvée',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeachingAssignmentController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: "Mettre à jour une affectation d'enseignement" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Affectation mise à jour avec succès',
        type: teaching_assignment_dto_1.TeachingAssignmentResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Affectation non trouvée',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Conflit : cette affectation existe déjà',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, teaching_assignment_dto_1.UpdateTeachingAssignmentDto]),
    __metadata("design:returntype", Promise)
], TeachingAssignmentController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: "Supprimer une affectation d'enseignement" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Affectation supprimée avec succès',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Affectation non trouvée',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeachingAssignmentController.prototype, "remove", null);
exports.TeachingAssignmentController = TeachingAssignmentController = __decorate([
    (0, swagger_1.ApiTags)('teaching-assignments'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('teaching-assignments'),
    __metadata("design:paramtypes", [teaching_assignment_service_1.TeachingAssignmentService])
], TeachingAssignmentController);
//# sourceMappingURL=teaching-assignment.controller.js.map