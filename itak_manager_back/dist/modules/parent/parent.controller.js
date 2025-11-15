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
exports.ParentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const parent_service_1 = require("./parent.service");
const parent_dto_1 = require("./dto/parent.dto");
let ParentController = class ParentController {
    parentService;
    constructor(parentService) {
        this.parentService = parentService;
    }
    async createParent(createParentDto) {
        return this.parentService.createParent(createParentDto);
    }
    async getAllParents() {
        return this.parentService.getAllParents();
    }
    async getParentById(id) {
        return this.parentService.getParentById(id);
    }
    async updateParent(id, updateParentDto) {
        return this.parentService.updateParent(id, updateParentDto);
    }
    async deleteParent(id) {
        return this.parentService.deleteParent(id);
    }
    async linkStudentToParent(createStudentParentDto) {
        return this.parentService.linkStudentToParent(createStudentParentDto);
    }
    async getStudentParents(studentId) {
        return this.parentService.getStudentParents(studentId);
    }
};
exports.ParentController = ParentController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Créer un parent' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Parent créé avec succès' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Données invalides' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Utilisateur déjà parent' }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parent_dto_1.CreateParentDto]),
    __metadata("design:returntype", Promise)
], ParentController.prototype, "createParent", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer tous les parents' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des parents' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ParentController.prototype, "getAllParents", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer un parent par ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Parent trouvé' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Parent non trouvé' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ParentController.prototype, "getParentById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour un parent' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Parent mis à jour' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Parent non trouvé' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, parent_dto_1.UpdateParentDto]),
    __metadata("design:returntype", Promise)
], ParentController.prototype, "updateParent", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un parent' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Parent supprimé' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Parent non trouvé' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ParentController.prototype, "deleteParent", null);
__decorate([
    (0, common_1.Post)('link-student'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Lier un étudiant à un parent' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Relation créée avec succès' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Données invalides' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Étudiant ou parent non trouvé' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Relation déjà existante' }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parent_dto_1.CreateStudentParentDto]),
    __metadata("design:returntype", Promise)
], ParentController.prototype, "linkStudentToParent", null);
__decorate([
    (0, common_1.Get)('student/:studentId/parents'),
    (0, swagger_1.ApiOperation)({ summary: "Récupérer les parents d'un étudiant" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Liste des parents de l'étudiant" }),
    __param(0, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ParentController.prototype, "getStudentParents", null);
exports.ParentController = ParentController = __decorate([
    (0, swagger_1.ApiTags)('parents'),
    (0, common_1.Controller)('parents'),
    __metadata("design:paramtypes", [parent_service_1.ParentService])
], ParentController);
//# sourceMappingURL=parent.controller.js.map