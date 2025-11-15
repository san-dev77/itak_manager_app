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
exports.InvoiceItemController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const invoice_item_service_1 = require("./invoice-item.service");
const invoice_item_dto_1 = require("./dto/invoice-item.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let InvoiceItemController = class InvoiceItemController {
    invoiceItemService;
    constructor(invoiceItemService) {
        this.invoiceItemService = invoiceItemService;
    }
    async create(createInvoiceItemDto) {
        return await this.invoiceItemService.create(createInvoiceItemDto);
    }
    async findAll() {
        return await this.invoiceItemService.findAll();
    }
    async findByInvoice(invoiceId) {
        return await this.invoiceItemService.findByInvoice(invoiceId);
    }
    async findOne(id) {
        return await this.invoiceItemService.findOne(id);
    }
    async update(id, updateInvoiceItemDto) {
        return await this.invoiceItemService.update(id, updateInvoiceItemDto);
    }
    async remove(id) {
        await this.invoiceItemService.remove(id);
        return { message: 'Ligne de facture supprimée avec succès' };
    }
};
exports.InvoiceItemController = InvoiceItemController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une nouvelle ligne de facture' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Ligne de facture créée avec succès',
        type: invoice_item_dto_1.InvoiceItemResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Facture ou frais étudiant non trouvé',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [invoice_item_dto_1.CreateInvoiceItemDto]),
    __metadata("design:returntype", Promise)
], InvoiceItemController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer toutes les lignes de facture' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Liste des lignes de facture',
        type: [invoice_item_dto_1.InvoiceItemResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InvoiceItemController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('invoice/:invoiceId'),
    (0, swagger_1.ApiOperation)({ summary: "Récupérer les lignes d'une facture" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lignes de la facture',
        type: [invoice_item_dto_1.InvoiceItemResponseDto],
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Facture non trouvée',
    }),
    __param(0, (0, common_1.Param)('invoiceId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvoiceItemController.prototype, "findByInvoice", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer une ligne de facture par ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Ligne de facture trouvée',
        type: invoice_item_dto_1.InvoiceItemResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Ligne de facture non trouvée',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvoiceItemController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour une ligne de facture' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Ligne de facture mise à jour avec succès',
        type: invoice_item_dto_1.InvoiceItemResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Ligne de facture non trouvée',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, invoice_item_dto_1.UpdateInvoiceItemDto]),
    __metadata("design:returntype", Promise)
], InvoiceItemController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer une ligne de facture' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Ligne de facture supprimée avec succès',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Ligne de facture non trouvée',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvoiceItemController.prototype, "remove", null);
exports.InvoiceItemController = InvoiceItemController = __decorate([
    (0, swagger_1.ApiTags)('invoice-items'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('invoice-items'),
    __metadata("design:paramtypes", [invoice_item_service_1.InvoiceItemService])
], InvoiceItemController);
//# sourceMappingURL=invoice-item.controller.js.map