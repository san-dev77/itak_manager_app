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
exports.StudentClassController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const student_class_service_1 = require("./student-class.service");
const student_class_dto_1 = require("./dto/student-class.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let StudentClassController = class StudentClassController {
    studentClassService;
    constructor(studentClassService) {
        this.studentClassService = studentClassService;
    }
    async create(createStudentClassDto) {
        return await this.studentClassService.createStudentClass(createStudentClassDto);
    }
    async findAll() {
        return await this.studentClassService.getAllStudentClasses();
    }
    async findByStudent(studentId) {
        return await this.studentClassService.getStudentClassesByStudent(studentId);
    }
    async findByClass(classId) {
        return await this.studentClassService.getStudentClassesByClass(classId);
    }
    async findOne(id) {
        return await this.studentClassService.getStudentClassById(id);
    }
    async update(id, updateStudentClassDto) {
        return await this.studentClassService.updateStudentClass(id, updateStudentClassDto);
    }
    async remove(id) {
        return await this.studentClassService.deleteStudentClass(id);
    }
};
exports.StudentClassController = StudentClassController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une nouvelle inscription étudiant-classe' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Inscription créée avec succès',
        type: student_class_dto_1.StudentClassResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Étudiant ou classe non trouvé',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Cette inscription existe déjà',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [student_class_dto_1.CreateStudentClassDto]),
    __metadata("design:returntype", Promise)
], StudentClassController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer toutes les inscriptions étudiant-classe',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Liste des inscriptions',
        type: [student_class_dto_1.StudentClassResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StudentClassController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('student/:studentId'),
    (0, swagger_1.ApiOperation)({ summary: "Récupérer les classes d'un étudiant" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Classes de l'étudiant",
        type: [student_class_dto_1.StudentClassResponseDto],
    }),
    __param(0, (0, common_1.Param)('studentId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentClassController.prototype, "findByStudent", null);
__decorate([
    (0, common_1.Get)('class/:classId'),
    (0, swagger_1.ApiOperation)({ summary: "Récupérer les étudiants d'une classe" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Étudiants de la classe',
        type: [student_class_dto_1.StudentClassResponseDto],
    }),
    __param(0, (0, common_1.Param)('classId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentClassController.prototype, "findByClass", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer une inscription par ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Inscription trouvée',
        type: student_class_dto_1.StudentClassResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Inscription non trouvée',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentClassController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour une inscription étudiant-classe' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Inscription mise à jour avec succès',
        type: student_class_dto_1.StudentClassResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Inscription non trouvée',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, student_class_dto_1.UpdateStudentClassDto]),
    __metadata("design:returntype", Promise)
], StudentClassController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer une inscription étudiant-classe' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Inscription supprimée avec succès',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Inscription non trouvée',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentClassController.prototype, "remove", null);
exports.StudentClassController = StudentClassController = __decorate([
    (0, swagger_1.ApiTags)('student-classes'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('student-classes'),
    __metadata("design:paramtypes", [student_class_service_1.StudentClassService])
], StudentClassController);
//# sourceMappingURL=student-class.controller.js.map