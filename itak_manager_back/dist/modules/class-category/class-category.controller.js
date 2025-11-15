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
exports.ClassCategoryController = void 0;
const common_1 = require("@nestjs/common");
const class_category_service_1 = require("./class-category.service");
const class_category_dto_1 = require("./dto/class-category.dto");
let ClassCategoryController = class ClassCategoryController {
    classCategoryService;
    constructor(classCategoryService) {
        this.classCategoryService = classCategoryService;
    }
    async createClassCategory(createClassCategoryDto) {
        return this.classCategoryService.createClassCategory(createClassCategoryDto);
    }
    async getAllClassCategories() {
        return this.classCategoryService.getAllClassCategories();
    }
    async getClassCategoryById(id) {
        return this.classCategoryService.getClassCategoryById(id);
    }
    async updateClassCategory(id, updateClassCategoryDto) {
        return this.classCategoryService.updateClassCategory(id, updateClassCategoryDto);
    }
    async deleteClassCategory(id) {
        return this.classCategoryService.deleteClassCategory(id);
    }
    async initializeDefaultCategories() {
        await this.classCategoryService.initializeDefaultCategories();
        return { message: 'Catégories par défaut initialisées avec succès' };
    }
};
exports.ClassCategoryController = ClassCategoryController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [class_category_dto_1.CreateClassCategoryDto]),
    __metadata("design:returntype", Promise)
], ClassCategoryController.prototype, "createClassCategory", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClassCategoryController.prototype, "getAllClassCategories", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClassCategoryController.prototype, "getClassCategoryById", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, class_category_dto_1.UpdateClassCategoryDto]),
    __metadata("design:returntype", Promise)
], ClassCategoryController.prototype, "updateClassCategory", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClassCategoryController.prototype, "deleteClassCategory", null);
__decorate([
    (0, common_1.Post)('initialize'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClassCategoryController.prototype, "initializeDefaultCategories", null);
exports.ClassCategoryController = ClassCategoryController = __decorate([
    (0, common_1.Controller)('class-categories'),
    __metadata("design:paramtypes", [class_category_service_1.ClassCategoryService])
], ClassCategoryController);
//# sourceMappingURL=class-category.controller.js.map