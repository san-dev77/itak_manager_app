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
exports.SchoolYearController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const school_year_service_1 = require("./school-year.service");
const school_year_dto_1 = require("./dto/school-year.dto");
let SchoolYearController = class SchoolYearController {
    schoolYearService;
    constructor(schoolYearService) {
        this.schoolYearService = schoolYearService;
    }
    async createSchoolYear(createSchoolYearDto) {
        try {
            return await this.schoolYearService.createSchoolYear(createSchoolYearDto);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new common_1.HttpException(message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllSchoolYears() {
        try {
            return await this.schoolYearService.getAllSchoolYears();
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new common_1.HttpException(message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getActiveSchoolYear() {
        try {
            return await this.schoolYearService.getActiveSchoolYear();
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new common_1.HttpException(message, common_1.HttpStatus.NOT_FOUND);
        }
    }
    async getSchoolYearById(id) {
        try {
            return await this.schoolYearService.getSchoolYearById(id);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new common_1.HttpException(message, common_1.HttpStatus.NOT_FOUND);
        }
    }
    async updateSchoolYear(id, updateSchoolYearDto) {
        try {
            return await this.schoolYearService.updateSchoolYear(id, updateSchoolYearDto);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new common_1.HttpException(message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async deleteSchoolYear(id) {
        try {
            await this.schoolYearService.deleteSchoolYear(id);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new common_1.HttpException(message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async setActiveSchoolYear(id) {
        try {
            return await this.schoolYearService.setActiveSchoolYear(id);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new common_1.HttpException(message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.SchoolYearController = SchoolYearController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une nouvelle année scolaire' }),
    (0, swagger_1.ApiBody)({ type: school_year_dto_1.CreateSchoolYearDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Année scolaire créée avec succès',
        type: school_year_dto_1.SchoolYearResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [school_year_dto_1.CreateSchoolYearDto]),
    __metadata("design:returntype", Promise)
], SchoolYearController.prototype, "createSchoolYear", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer toutes les années scolaires' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Liste des années scolaires',
        type: [school_year_dto_1.SchoolYearResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchoolYearController.prototype, "getAllSchoolYears", null);
__decorate([
    (0, common_1.Get)('active'),
    (0, swagger_1.ApiOperation)({ summary: "Récupérer l'année scolaire active" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Année scolaire active',
        type: school_year_dto_1.SchoolYearResponseDto,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchoolYearController.prototype, "getActiveSchoolYear", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer une année scolaire par ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: "ID de l'année scolaire" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Année scolaire trouvée',
        type: school_year_dto_1.SchoolYearResponseDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SchoolYearController.prototype, "getSchoolYearById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour une année scolaire' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: "ID de l'année scolaire" }),
    (0, swagger_1.ApiBody)({ type: school_year_dto_1.UpdateSchoolYearDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Année scolaire mise à jour avec succès',
        type: school_year_dto_1.SchoolYearResponseDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, school_year_dto_1.UpdateSchoolYearDto]),
    __metadata("design:returntype", Promise)
], SchoolYearController.prototype, "updateSchoolYear", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer une année scolaire' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: "ID de l'année scolaire" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Année scolaire supprimée avec succès',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SchoolYearController.prototype, "deleteSchoolYear", null);
__decorate([
    (0, common_1.Patch)(':id/activate'),
    (0, swagger_1.ApiOperation)({ summary: 'Activer une année scolaire' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: "ID de l'année scolaire" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Année scolaire activée avec succès',
        type: school_year_dto_1.SchoolYearResponseDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SchoolYearController.prototype, "setActiveSchoolYear", null);
exports.SchoolYearController = SchoolYearController = __decorate([
    (0, swagger_1.ApiTags)('Années Scolaires'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('school-years'),
    __metadata("design:paramtypes", [school_year_service_1.SchoolYearService])
], SchoolYearController);
//# sourceMappingURL=school-year.controller.js.map