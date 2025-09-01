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
exports.SupabaseController = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../services/supabase.service");
let SupabaseController = class SupabaseController {
    supabaseService;
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async testConnection() {
        try {
            return {
                message: 'Connexion Supabase établie avec succès!',
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            return {
                error: 'Erreur de connexion Supabase',
                details: error.message,
            };
        }
    }
    async getTables() {
        try {
            const tables = await this.supabaseService.getData('information_schema.tables', 'table_name');
            return { tables };
        }
        catch (error) {
            return {
                error: 'Erreur lors de la récupération des tables',
                details: error.message,
            };
        }
    }
    async insertData(table, data) {
        try {
            const result = await this.supabaseService.insertData(table, data);
            return {
                message: 'Données insérées avec succès',
                data: result,
            };
        }
        catch (error) {
            return {
                error: "Erreur lors de l'insertion",
                details: error.message,
            };
        }
    }
    async getData(table) {
        try {
            const data = await this.supabaseService.getData(table);
            return {
                message: 'Données récupérées avec succès',
                data,
            };
        }
        catch (error) {
            return {
                error: 'Erreur lors de la récupération',
                details: error.message,
            };
        }
    }
};
exports.SupabaseController = SupabaseController;
__decorate([
    (0, common_1.Get)('test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SupabaseController.prototype, "testConnection", null);
__decorate([
    (0, common_1.Get)('tables'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SupabaseController.prototype, "getTables", null);
__decorate([
    (0, common_1.Post)('data/:table'),
    __param(0, (0, common_1.Param)('table')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SupabaseController.prototype, "insertData", null);
__decorate([
    (0, common_1.Get)('data/:table'),
    __param(0, (0, common_1.Param)('table')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SupabaseController.prototype, "getData", null);
exports.SupabaseController = SupabaseController = __decorate([
    (0, common_1.Controller)('api/supabase'),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], SupabaseController);
//# sourceMappingURL=supabase.controller.js.map