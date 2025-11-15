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
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const payment_service_1 = require("./payment.service");
const payment_dto_1 = require("./dto/payment.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let PaymentController = class PaymentController {
    paymentService;
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async create(createPaymentDto) {
        return await this.paymentService.create(createPaymentDto);
    }
    async findAll() {
        return await this.paymentService.findAll();
    }
    async getSummary() {
        return await this.paymentService.getPaymentSummary();
    }
    async findByStudentFee(studentFeeId) {
        return await this.paymentService.findByStudentFee(studentFeeId);
    }
    async findByUser(userId) {
        return await this.paymentService.findByUser(userId);
    }
    async findOne(id) {
        return await this.paymentService.findOne(id);
    }
    async update(id, updatePaymentDto) {
        return await this.paymentService.update(id, updatePaymentDto);
    }
    async remove(id) {
        await this.paymentService.remove(id);
        return { message: 'Paiement supprimé avec succès' };
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Enregistrer un nouveau paiement' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Paiement enregistré avec succès',
        type: payment_dto_1.PaymentResponseDto,
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
    __metadata("design:paramtypes", [payment_dto_1.CreatePaymentDto]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer tous les paiements' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Liste des paiements',
        type: [payment_dto_1.PaymentResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer le résumé des paiements' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Résumé des paiements',
        type: payment_dto_1.PaymentSummaryDto,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('student-fee/:studentFeeId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer les paiements pour des frais spécifiques',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Paiements pour les frais spécifiés',
        type: [payment_dto_1.PaymentResponseDto],
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Frais étudiant non trouvé',
    }),
    __param(0, (0, common_1.Param)('studentFeeId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "findByStudentFee", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer les paiements reçus par un utilisateur' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Paiements reçus par l'utilisateur",
        type: [payment_dto_1.PaymentResponseDto],
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Utilisateur non trouvé',
    }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer un paiement par ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Paiement trouvé',
        type: payment_dto_1.PaymentResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Paiement non trouvé',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour un paiement' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Paiement mis à jour avec succès',
        type: payment_dto_1.PaymentResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Paiement non trouvé',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payment_dto_1.UpdatePaymentDto]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un paiement' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Paiement supprimé avec succès',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Paiement non trouvé',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "remove", null);
exports.PaymentController = PaymentController = __decorate([
    (0, swagger_1.ApiTags)('payments'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map