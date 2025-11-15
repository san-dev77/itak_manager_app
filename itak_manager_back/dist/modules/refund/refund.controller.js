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
exports.RefundController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const refund_service_1 = require("./refund.service");
const refund_dto_1 = require("./dto/refund.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let RefundController = class RefundController {
    refundService;
    constructor(refundService) {
        this.refundService = refundService;
    }
    async create(createRefundDto) {
        return await this.refundService.create(createRefundDto);
    }
    async findAll() {
        return await this.refundService.findAll();
    }
    async getSummary() {
        return await this.refundService.getRefundSummary();
    }
    async findByPayment(paymentId) {
        return await this.refundService.findByPayment(paymentId);
    }
    async findByUser(userId) {
        return await this.refundService.findByUser(userId);
    }
    async findOne(id) {
        return await this.refundService.findOne(id);
    }
    async update(id, updateRefundDto) {
        return await this.refundService.update(id, updateRefundDto);
    }
    async remove(id) {
        await this.refundService.remove(id);
        return { message: 'Remboursement supprimé avec succès' };
    }
};
exports.RefundController = RefundController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer un nouveau remboursement' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Remboursement créé avec succès',
        type: refund_dto_1.RefundResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Montant invalide ou paiement non éligible',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Paiement ou utilisateur non trouvé',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refund_dto_1.CreateRefundDto]),
    __metadata("design:returntype", Promise)
], RefundController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer tous les remboursements' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Liste des remboursements',
        type: [refund_dto_1.RefundResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RefundController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer le résumé des remboursements' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Résumé des remboursements',
        type: refund_dto_1.RefundSummaryDto,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RefundController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('payment/:paymentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer les remboursements pour un paiement' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Remboursements pour le paiement spécifié',
        type: [refund_dto_1.RefundResponseDto],
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Paiement non trouvé',
    }),
    __param(0, (0, common_1.Param)('paymentId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RefundController.prototype, "findByPayment", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer les remboursements traités par un utilisateur',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Remboursements traités par l'utilisateur",
        type: [refund_dto_1.RefundResponseDto],
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Utilisateur non trouvé',
    }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RefundController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer un remboursement par ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Remboursement trouvé',
        type: refund_dto_1.RefundResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Remboursement non trouvé',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RefundController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour un remboursement' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Remboursement mis à jour avec succès',
        type: refund_dto_1.RefundResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Remboursement non trouvé',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, refund_dto_1.UpdateRefundDto]),
    __metadata("design:returntype", Promise)
], RefundController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un remboursement' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Remboursement supprimé avec succès',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Remboursement non trouvé',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RefundController.prototype, "remove", null);
exports.RefundController = RefundController = __decorate([
    (0, swagger_1.ApiTags)('refunds'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('refunds'),
    __metadata("design:paramtypes", [refund_service_1.RefundService])
], RefundController);
//# sourceMappingURL=refund.controller.js.map