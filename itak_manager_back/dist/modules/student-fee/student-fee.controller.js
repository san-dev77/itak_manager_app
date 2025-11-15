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
exports.StudentFeeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const student_fee_service_1 = require("./student-fee.service");
const student_fee_dto_1 = require("./dto/student-fee.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let StudentFeeController = class StudentFeeController {
    studentFeeService;
    constructor(studentFeeService) {
        this.studentFeeService = studentFeeService;
    }
    async create(createStudentFeeDto) {
        return await this.studentFeeService.create(createStudentFeeDto);
    }
    async findAll() {
        return await this.studentFeeService.findAll();
    }
    async findOverdue() {
        return await this.studentFeeService.findOverdueFees();
    }
    async markOverdue() {
        await this.studentFeeService.markOverdueFees();
        return { message: 'Frais en retard marqués avec succès' };
    }
    async findByStudent(studentId) {
        return await this.studentFeeService.findByStudent(studentId);
    }
    async getStudentSummary(studentId) {
        return await this.studentFeeService.getStudentFeesSummary(studentId);
    }
    async findOne(id) {
        return await this.studentFeeService.findOne(id);
    }
    async update(id, updateStudentFeeDto) {
        return await this.studentFeeService.update(id, updateStudentFeeDto);
    }
    async payFee(id, payStudentFeeDto) {
        return await this.studentFeeService.payFee(id, payStudentFeeDto);
    }
    async remove(id) {
        await this.studentFeeService.remove(id);
        return { message: 'Frais supprimés avec succès' };
    }
};
exports.StudentFeeController = StudentFeeController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Assigner des frais à un étudiant' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Frais assignés avec succès',
        type: student_fee_dto_1.StudentFeeResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Étudiant ou type de frais non trouvé',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Des frais de ce type existent déjà pour cet étudiant',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [student_fee_dto_1.CreateStudentFeeDto]),
    __metadata("design:returntype", Promise)
], StudentFeeController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer tous les frais des étudiants' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Liste des frais des étudiants',
        type: [student_fee_dto_1.StudentFeeResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StudentFeeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('overdue'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer tous les frais en retard' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Liste des frais en retard',
        type: [student_fee_dto_1.StudentFeeResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StudentFeeController.prototype, "findOverdue", null);
__decorate([
    (0, common_1.Post)('mark-overdue'),
    (0, swagger_1.ApiOperation)({ summary: 'Marquer les frais en retard' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Frais en retard marqués avec succès',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StudentFeeController.prototype, "markOverdue", null);
__decorate([
    (0, common_1.Get)('student/:studentId'),
    (0, swagger_1.ApiOperation)({ summary: "Récupérer les frais d'un étudiant" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Frais de l'étudiant",
        type: [student_fee_dto_1.StudentFeeResponseDto],
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Étudiant non trouvé',
    }),
    __param(0, (0, common_1.Param)('studentId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentFeeController.prototype, "findByStudent", null);
__decorate([
    (0, common_1.Get)('student/:studentId/summary'),
    (0, swagger_1.ApiOperation)({ summary: "Récupérer le résumé des frais d'un étudiant" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Résumé des frais de l'étudiant",
        type: student_fee_dto_1.StudentFeesSummaryDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Étudiant non trouvé',
    }),
    __param(0, (0, common_1.Param)('studentId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentFeeController.prototype, "getStudentSummary", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer des frais par ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Frais trouvés',
        type: student_fee_dto_1.StudentFeeResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Frais non trouvés',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentFeeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour des frais' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Frais mis à jour avec succès',
        type: student_fee_dto_1.StudentFeeResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Frais non trouvés',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, student_fee_dto_1.UpdateStudentFeeDto]),
    __metadata("design:returntype", Promise)
], StudentFeeController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/pay'),
    (0, swagger_1.ApiOperation)({ summary: 'Effectuer un paiement sur des frais' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Paiement effectué avec succès',
        type: student_fee_dto_1.StudentFeeResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Montant du paiement invalide',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Frais non trouvés',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, student_fee_dto_1.PayStudentFeeDto]),
    __metadata("design:returntype", Promise)
], StudentFeeController.prototype, "payFee", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer des frais' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Frais supprimés avec succès',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Frais non trouvés',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentFeeController.prototype, "remove", null);
exports.StudentFeeController = StudentFeeController = __decorate([
    (0, swagger_1.ApiTags)('student-fees'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('student-fees'),
    __metadata("design:paramtypes", [student_fee_service_1.StudentFeeService])
], StudentFeeController);
//# sourceMappingURL=student-fee.controller.js.map