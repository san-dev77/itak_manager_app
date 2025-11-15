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
exports.FeeTypeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const fee_type_service_1 = require("./fee-type.service");
const fee_type_dto_1 = require("./dto/fee-type.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let FeeTypeController = class FeeTypeController {
    feeTypeService;
    constructor(feeTypeService) {
        this.feeTypeService = feeTypeService;
    }
    async create(createFeeTypeDto) {
        return await this.feeTypeService.create(createFeeTypeDto);
    }
    async findAll() {
        return await this.feeTypeService.findAll();
    }
    async findRecurring() {
        return await this.feeTypeService.findRecurringFeeTypes();
    }
    async findOne(id) {
        return await this.feeTypeService.findOne(id);
    }
    async update(id, updateFeeTypeDto) {
        return await this.feeTypeService.update(id, updateFeeTypeDto);
    }
    async remove(id) {
        await this.feeTypeService.remove(id);
        return { message: 'Type de frais supprimé avec succès' };
    }
};
exports.FeeTypeController = FeeTypeController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer un nouveau type de frais' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Type de frais créé avec succès',
        type: fee_type_dto_1.FeeTypeResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Un type de frais avec ce nom existe déjà',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fee_type_dto_1.CreateFeeTypeDto]),
    __metadata("design:returntype", Promise)
], FeeTypeController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer tous les types de frais' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Liste des types de frais',
        type: [fee_type_dto_1.FeeTypeResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FeeTypeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('recurring'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer tous les types de frais récurrents' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Liste des types de frais récurrents',
        type: [fee_type_dto_1.FeeTypeResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FeeTypeController.prototype, "findRecurring", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer un type de frais par ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Type de frais trouvé',
        type: fee_type_dto_1.FeeTypeResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Type de frais non trouvé',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FeeTypeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour un type de frais' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Type de frais mis à jour avec succès',
        type: fee_type_dto_1.FeeTypeResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Type de frais non trouvé',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Un type de frais avec ce nom existe déjà',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, fee_type_dto_1.UpdateFeeTypeDto]),
    __metadata("design:returntype", Promise)
], FeeTypeController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un type de frais' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Type de frais supprimé avec succès',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Type de frais non trouvé',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FeeTypeController.prototype, "remove", null);
exports.FeeTypeController = FeeTypeController = __decorate([
    (0, swagger_1.ApiTags)('fee-types'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('fee-types'),
    __metadata("design:paramtypes", [fee_type_service_1.FeeTypeService])
], FeeTypeController);
//# sourceMappingURL=fee-type.controller.js.map