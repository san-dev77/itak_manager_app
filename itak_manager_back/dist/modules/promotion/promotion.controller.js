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
exports.PromotionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const promotion_service_1 = require("./promotion.service");
const promotion_dto_1 = require("./dto/promotion.dto");
const class_entity_1 = require("../../entities/class.entity");
let PromotionController = class PromotionController {
    promotionService;
    constructor(promotionService) {
        this.promotionService = promotionService;
    }
    async getNextClass(classId) {
        try {
            return await this.promotionService.getNextClass(classId);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new common_1.HttpException(message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async promoteStudent(createPromotionDto) {
        try {
            return await this.promotionService.promoteStudent(createPromotionDto);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new common_1.HttpException(message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async bulkPromoteClass(bulkPromotionDto) {
        try {
            return await this.promotionService.bulkPromoteClass(bulkPromotionDto);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new common_1.HttpException(message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getPromotionHistory(studentId) {
        try {
            return await this.promotionService.getPromotionHistory(studentId);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new common_1.HttpException(message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getClassesByOrderLevel(categoryId) {
        try {
            return await this.promotionService.getClassesByOrderLevel(categoryId);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new common_1.HttpException(message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.PromotionController = PromotionController;
__decorate([
    (0, common_1.Get)('next-class/:classId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtenir la classe supérieure pour une classe donnée',
    }),
    (0, swagger_1.ApiParam)({ name: 'classId', description: 'ID de la classe actuelle' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Informations sur la classe supérieure',
        type: promotion_dto_1.NextClassResponseDto,
    }),
    __param(0, (0, common_1.Param)('classId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PromotionController.prototype, "getNextClass", null);
__decorate([
    (0, common_1.Post)('promote-student'),
    (0, swagger_1.ApiOperation)({
        summary: 'Promouvoir un étudiant vers une classe supérieure',
    }),
    (0, swagger_1.ApiBody)({ type: promotion_dto_1.CreatePromotionDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Étudiant promu avec succès',
        type: promotion_dto_1.PromotionResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [promotion_dto_1.CreatePromotionDto]),
    __metadata("design:returntype", Promise)
], PromotionController.prototype, "promoteStudent", null);
__decorate([
    (0, common_1.Post)('bulk-promote'),
    (0, swagger_1.ApiOperation)({
        summary: "Promouvoir tous les étudiants d'une classe vers une classe supérieure",
    }),
    (0, swagger_1.ApiBody)({ type: promotion_dto_1.BulkPromotionDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Étudiants promus en masse avec succès',
        type: [promotion_dto_1.PromotionResponseDto],
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [promotion_dto_1.BulkPromotionDto]),
    __metadata("design:returntype", Promise)
], PromotionController.prototype, "bulkPromoteClass", null);
__decorate([
    (0, common_1.Get)('history/:studentId'),
    (0, swagger_1.ApiOperation)({
        summary: "Obtenir l'historique des promotions d'un étudiant",
    }),
    (0, swagger_1.ApiParam)({ name: 'studentId', description: "ID de l'étudiant" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Historique des promotions',
        type: [promotion_dto_1.PromotionResponseDto],
    }),
    __param(0, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PromotionController.prototype, "getPromotionHistory", null);
__decorate([
    (0, common_1.Get)('classes-by-level/:categoryId'),
    (0, swagger_1.ApiOperation)({
        summary: "Obtenir les classes d'une catégorie triées par niveau hiérarchique",
    }),
    (0, swagger_1.ApiParam)({ name: 'categoryId', description: 'ID de la catégorie de classe' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Liste des classes triées par niveau',
        type: [class_entity_1.Class],
    }),
    __param(0, (0, common_1.Param)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PromotionController.prototype, "getClassesByOrderLevel", null);
exports.PromotionController = PromotionController = __decorate([
    (0, swagger_1.ApiTags)('Promotions'),
    (0, common_1.Controller)('promotions'),
    __metadata("design:paramtypes", [promotion_service_1.PromotionService])
], PromotionController);
//# sourceMappingURL=promotion.controller.js.map