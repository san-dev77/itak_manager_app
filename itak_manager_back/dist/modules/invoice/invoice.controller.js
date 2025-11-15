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
exports.InvoiceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const invoice_service_1 = require("./invoice.service");
const invoice_dto_1 = require("./dto/invoice.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let InvoiceController = class InvoiceController {
    invoiceService;
    constructor(invoiceService) {
        this.invoiceService = invoiceService;
    }
    async create(createInvoiceDto) {
        return await this.invoiceService.create(createInvoiceDto);
    }
    async findAll() {
        return await this.invoiceService.findAll();
    }
    async generateInvoiceNumber() {
        const invoiceNumber = await this.invoiceService.generateInvoiceNumber();
        return { invoiceNumber };
    }
    async findByStudent(studentId) {
        return await this.invoiceService.findByStudent(studentId);
    }
    async findByInvoiceNumber(invoiceNumber) {
        return await this.invoiceService.findByInvoiceNumber(invoiceNumber);
    }
    async findOne(id) {
        return await this.invoiceService.findOne(id);
    }
    async update(id, updateInvoiceDto) {
        return await this.invoiceService.update(id, updateInvoiceDto);
    }
    async remove(id) {
        await this.invoiceService.remove(id);
        return { message: 'Facture supprimée avec succès' };
    }
};
exports.InvoiceController = InvoiceController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une nouvelle facture' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Facture créée avec succès',
        type: invoice_dto_1.InvoiceResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Données invalides',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Étudiant non trouvé',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Numéro de facture déjà existant',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [invoice_dto_1.CreateInvoiceDto]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer toutes les factures' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Liste des factures',
        type: [invoice_dto_1.InvoiceResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('generate-number'),
    (0, swagger_1.ApiOperation)({ summary: 'Générer un nouveau numéro de facture' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Numéro de facture généré',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "generateInvoiceNumber", null);
__decorate([
    (0, common_1.Get)('student/:studentId'),
    (0, swagger_1.ApiOperation)({ summary: "Récupérer les factures d'un étudiant" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Factures de l'étudiant",
        type: [invoice_dto_1.InvoiceResponseDto],
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Étudiant non trouvé',
    }),
    __param(0, (0, common_1.Param)('studentId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "findByStudent", null);
__decorate([
    (0, common_1.Get)('number/:invoiceNumber'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer une facture par son numéro' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Facture trouvée',
        type: invoice_dto_1.InvoiceResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Facture non trouvée',
    }),
    __param(0, (0, common_1.Param)('invoiceNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "findByInvoiceNumber", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer une facture par ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Facture trouvée',
        type: invoice_dto_1.InvoiceResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Facture non trouvée',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour une facture' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Facture mise à jour avec succès',
        type: invoice_dto_1.InvoiceResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Facture non trouvée',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Numéro de facture déjà existant',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, invoice_dto_1.UpdateInvoiceDto]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer une facture' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Facture supprimée avec succès',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Facture non trouvée',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "remove", null);
exports.InvoiceController = InvoiceController = __decorate([
    (0, swagger_1.ApiTags)('invoices'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('invoices'),
    __metadata("design:paramtypes", [invoice_service_1.InvoiceService])
], InvoiceController);
//# sourceMappingURL=invoice.controller.js.map