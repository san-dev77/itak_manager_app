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
exports.TermController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const term_service_1 = require("./term.service");
const term_dto_1 = require("./dto/term.dto");
let TermController = class TermController {
    termService;
    constructor(termService) {
        this.termService = termService;
    }
    async createTerm(createTermDto) {
        try {
            return await this.termService.createTerm(createTermDto);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new common_1.HttpException(message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllTerms() {
        try {
            return await this.termService.getAllTerms();
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new common_1.HttpException(message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getActiveTerm() {
        try {
            return await this.termService.getActiveTerm();
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new common_1.HttpException(message, common_1.HttpStatus.NOT_FOUND);
        }
    }
    async getTermsBySchoolYear(schoolYearId) {
        try {
            return await this.termService.getTermsBySchoolYear(schoolYearId);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new common_1.HttpException(message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getTermById(id) {
        try {
            return await this.termService.getTermById(id);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new common_1.HttpException(message, common_1.HttpStatus.NOT_FOUND);
        }
    }
    async updateTerm(id, updateTermDto) {
        try {
            return await this.termService.updateTerm(id, updateTermDto);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new common_1.HttpException(message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async deleteTerm(id) {
        try {
            await this.termService.deleteTerm(id);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new common_1.HttpException(message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async setActiveTerm(id) {
        try {
            return await this.termService.setActiveTerm(id);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new common_1.HttpException(message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.TermController = TermController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer un nouveau trimestre' }),
    (0, swagger_1.ApiBody)({ type: term_dto_1.CreateTermDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Trimestre créé avec succès',
        type: term_dto_1.TermResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [term_dto_1.CreateTermDto]),
    __metadata("design:returntype", Promise)
], TermController.prototype, "createTerm", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer tous les trimestres' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Liste des trimestres',
        type: [term_dto_1.TermResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TermController.prototype, "getAllTerms", null);
__decorate([
    (0, common_1.Get)('active'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer le trimestre actif' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Trimestre actif',
        type: term_dto_1.TermResponseDto,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TermController.prototype, "getActiveTerm", null);
__decorate([
    (0, common_1.Get)('school-year/:schoolYearId'),
    (0, swagger_1.ApiOperation)({ summary: "Récupérer les trimestres d'une année scolaire" }),
    (0, swagger_1.ApiParam)({ name: 'schoolYearId', description: "ID de l'année scolaire" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Liste des trimestres de l'année scolaire",
        type: [term_dto_1.TermResponseDto],
    }),
    __param(0, (0, common_1.Param)('schoolYearId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TermController.prototype, "getTermsBySchoolYear", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer un trimestre par ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID du trimestre' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Trimestre trouvé',
        type: term_dto_1.TermResponseDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TermController.prototype, "getTermById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour un trimestre' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID du trimestre' }),
    (0, swagger_1.ApiBody)({ type: term_dto_1.UpdateTermDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Trimestre mis à jour avec succès',
        type: term_dto_1.TermResponseDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, term_dto_1.UpdateTermDto]),
    __metadata("design:returntype", Promise)
], TermController.prototype, "updateTerm", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un trimestre' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID du trimestre' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Trimestre supprimé avec succès',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TermController.prototype, "deleteTerm", null);
__decorate([
    (0, common_1.Patch)(':id/activate'),
    (0, swagger_1.ApiOperation)({ summary: 'Activer un trimestre' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID du trimestre' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Trimestre activé avec succès',
        type: term_dto_1.TermResponseDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TermController.prototype, "setActiveTerm", null);
exports.TermController = TermController = __decorate([
    (0, swagger_1.ApiTags)('Trimestres'),
    (0, common_1.Controller)('terms'),
    __metadata("design:paramtypes", [term_service_1.TermService])
], TermController);
//# sourceMappingURL=term.controller.js.map