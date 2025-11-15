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
exports.TimetableController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const timetable_service_1 = require("./timetable.service");
const timetable_dto_1 = require("./dto/timetable.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let TimetableController = class TimetableController {
    timetableService;
    constructor(timetableService) {
        this.timetableService = timetableService;
    }
    async create(createTimetableDto) {
        return await this.timetableService.create(createTimetableDto);
    }
    async findAll() {
        return await this.timetableService.findAll();
    }
    async findByClass(classId, academicYearId) {
        return await this.timetableService.findByClass(classId, academicYearId);
    }
    async findByTeacher(teacherId, academicYearId) {
        return await this.timetableService.findByTeacher(teacherId, academicYearId);
    }
    async getWeeklyTimetable(classId, academicYearId) {
        return await this.timetableService.getWeeklyTimetable(classId, academicYearId);
    }
    async findOne(id) {
        return await this.timetableService.findOne(id);
    }
    async update(id, updateTimetableDto) {
        return await this.timetableService.update(id, updateTimetableDto);
    }
    async remove(id) {
        await this.timetableService.remove(id);
        return { message: 'Emploi du temps supprimé avec succès' };
    }
};
exports.TimetableController = TimetableController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer un nouvel emploi du temps' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Emploi du temps créé avec succès',
        type: timetable_dto_1.TimetableResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "Données invalides ou conflit d'horaire",
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Classe, enseignant, matière ou année scolaire non trouvé(e)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: "Conflit d'horaire détecté",
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [timetable_dto_1.CreateTimetableDto]),
    __metadata("design:returntype", Promise)
], TimetableController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer tous les emplois du temps' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Liste des emplois du temps',
        type: [timetable_dto_1.TimetableResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TimetableController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('class/:classId'),
    (0, swagger_1.ApiOperation)({ summary: "Récupérer l'emploi du temps d'une classe" }),
    (0, swagger_1.ApiQuery)({
        name: 'academicYearId',
        required: true,
        description: "ID de l'année scolaire",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Emploi du temps de la classe',
        type: [timetable_dto_1.TimetableResponseDto],
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Classe non trouvée',
    }),
    __param(0, (0, common_1.Param)('classId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('academicYearId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TimetableController.prototype, "findByClass", null);
__decorate([
    (0, common_1.Get)('teacher/:teacherId'),
    (0, swagger_1.ApiOperation)({ summary: "Récupérer l'emploi du temps d'un enseignant" }),
    (0, swagger_1.ApiQuery)({
        name: 'academicYearId',
        required: true,
        description: "ID de l'année scolaire",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Emploi du temps de l'enseignant",
        type: [timetable_dto_1.TimetableResponseDto],
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Enseignant non trouvé',
    }),
    __param(0, (0, common_1.Param)('teacherId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('academicYearId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TimetableController.prototype, "findByTeacher", null);
__decorate([
    (0, common_1.Get)('weekly/:classId'),
    (0, swagger_1.ApiOperation)({
        summary: "Récupérer l'emploi du temps hebdomadaire d'une classe",
    }),
    (0, swagger_1.ApiQuery)({
        name: 'academicYearId',
        required: true,
        description: "ID de l'année scolaire",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Emploi du temps hebdomadaire de la classe',
        type: timetable_dto_1.WeeklyTimetableDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Classe non trouvée',
    }),
    __param(0, (0, common_1.Param)('classId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('academicYearId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TimetableController.prototype, "getWeeklyTimetable", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer un emploi du temps par ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Emploi du temps trouvé',
        type: timetable_dto_1.TimetableResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Emploi du temps non trouvé',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TimetableController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour un emploi du temps' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Emploi du temps mis à jour avec succès',
        type: timetable_dto_1.TimetableResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Données invalides',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Emploi du temps non trouvé',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, timetable_dto_1.UpdateTimetableDto]),
    __metadata("design:returntype", Promise)
], TimetableController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un emploi du temps' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Emploi du temps supprimé avec succès',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Emploi du temps non trouvé',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TimetableController.prototype, "remove", null);
exports.TimetableController = TimetableController = __decorate([
    (0, swagger_1.ApiTags)('timetables'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('timetables'),
    __metadata("design:paramtypes", [timetable_service_1.TimetableService])
], TimetableController);
//# sourceMappingURL=timetable.controller.js.map