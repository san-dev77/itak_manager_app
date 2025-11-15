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
exports.DiscountController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const discount_service_1 = require("./discount.service");
const discount_dto_1 = require("./dto/discount.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let DiscountController = class DiscountController {
    discountService;
    constructor(discountService) {
        this.discountService = discountService;
    }
    async create(createDiscountDto) {
        return await this.discountService.create(createDiscountDto);
    }
    async findAll() {
        return await this.discountService.findAll();
    }
    async findByStudentFee(studentFeeId) {
        return await this.discountService.findByStudentFee(studentFeeId);
    }
    async findOne(id) {
        return await this.discountService.findOne(id);
    }
    async update(id, updateDiscountDto) {
        return await this.discountService.update(id, updateDiscountDto);
    }
    async remove(id) {
        await this.discountService.remove(id);
        return { message: 'Réduction supprimée avec succès' };
    }
};
exports.DiscountController = DiscountController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une nouvelle réduction' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Réduction créée avec succès',
        type: discount_dto_1.DiscountResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Montant invalide ou données incorretes',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Frais étudiant ou utilisateur non trouvé',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discount_dto_1.CreateDiscountDto]),
    __metadata("design:returntype", Promise)
], DiscountController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer toutes les réductions' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Liste des réductions',
        type: [discount_dto_1.DiscountResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DiscountController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('student-fee/:studentFeeId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer les réductions pour des frais spécifiques',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Réductions pour les frais spécifiés',
        type: [discount_dto_1.DiscountResponseDto],
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Frais étudiant non trouvé',
    }),
    __param(0, (0, common_1.Param)('studentFeeId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DiscountController.prototype, "findByStudentFee", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer une réduction par ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Réduction trouvée',
        type: discount_dto_1.DiscountResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Réduction non trouvée',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DiscountController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour une réduction' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Réduction mise à jour avec succès',
        type: discount_dto_1.DiscountResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Réduction non trouvée',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, discount_dto_1.UpdateDiscountDto]),
    __metadata("design:returntype", Promise)
], DiscountController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer une réduction' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Réduction supprimée avec succès',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Réduction non trouvée',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DiscountController.prototype, "remove", null);
exports.DiscountController = DiscountController = __decorate([
    (0, swagger_1.ApiTags)('discounts'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('discounts'),
    __metadata("design:paramtypes", [discount_service_1.DiscountService])
], DiscountController);
//# sourceMappingURL=discount.controller.js.map