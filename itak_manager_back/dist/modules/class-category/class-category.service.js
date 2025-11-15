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
exports.ClassCategoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const class_category_entity_1 = require("../../entities/class-category.entity");
let ClassCategoryService = class ClassCategoryService {
    classCategoryRepository;
    constructor(classCategoryRepository) {
        this.classCategoryRepository = classCategoryRepository;
    }
    async createClassCategory(createClassCategoryDto) {
        try {
            const existingCategory = await this.classCategoryRepository.findOne({
                where: { name: createClassCategoryDto.name },
            });
            if (existingCategory) {
                throw new common_1.ConflictException('Une catégorie avec ce nom existe déjà');
            }
            const category = this.classCategoryRepository.create(createClassCategoryDto);
            const savedCategory = await this.classCategoryRepository.save(category);
            return this.mapToClassCategory(savedCategory);
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la création de la catégorie: ${message}`);
        }
    }
    async getAllClassCategories() {
        try {
            const categories = await this.classCategoryRepository.find({
                order: { createdAt: 'DESC' },
            });
            return categories.map((category) => this.mapToClassCategory(category));
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération des catégories: ${message}`);
        }
    }
    async getClassCategoryById(id) {
        try {
            const category = await this.classCategoryRepository.findOne({
                where: { id },
            });
            if (!category) {
                throw new common_1.NotFoundException('Catégorie non trouvée');
            }
            return this.mapToClassCategory(category);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération de la catégorie: ${message}`);
        }
    }
    async getClassCategoryByName(name) {
        try {
            const category = await this.classCategoryRepository.findOne({
                where: { name },
            });
            if (!category) {
                throw new common_1.NotFoundException('Catégorie non trouvée');
            }
            return this.mapToClassCategory(category);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération de la catégorie: ${message}`);
        }
    }
    async updateClassCategory(id, updateClassCategoryDto) {
        try {
            await this.getClassCategoryById(id);
            if (updateClassCategoryDto.name) {
                const existingCategory = await this.classCategoryRepository.findOne({
                    where: { name: updateClassCategoryDto.name },
                });
                if (existingCategory && existingCategory.id !== id) {
                    throw new common_1.ConflictException('Une catégorie avec ce nom existe déjà');
                }
            }
            await this.classCategoryRepository.update(id, updateClassCategoryDto);
            const updatedCategory = await this.classCategoryRepository.findOne({
                where: { id },
            });
            if (!updatedCategory) {
                throw new common_1.NotFoundException('Catégorie non trouvée après mise à jour');
            }
            return this.mapToClassCategory(updatedCategory);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la mise à jour de la catégorie: ${message}`);
        }
    }
    async deleteClassCategory(id) {
        try {
            await this.getClassCategoryById(id);
            await this.classCategoryRepository.delete(id);
            return { message: 'Catégorie supprimée avec succès' };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la suppression de la catégorie: ${message}`);
        }
    }
    async initializeDefaultCategories() {
        try {
            const defaultCategories = [{ name: 'Collège' }, { name: 'Faculté' }];
            for (const category of defaultCategories) {
                const existingCategory = await this.classCategoryRepository.findOne({
                    where: { name: category.name },
                });
                if (!existingCategory) {
                    const newCategory = this.classCategoryRepository.create(category);
                    await this.classCategoryRepository.save(newCategory);
                }
            }
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            console.log('Catégories par défaut déjà initialisées ou erreur:', message);
        }
    }
    mapToClassCategory(category) {
        return {
            id: category.id,
            name: category.name,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
        };
    }
};
exports.ClassCategoryService = ClassCategoryService;
exports.ClassCategoryService = ClassCategoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(class_category_entity_1.ClassCategory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ClassCategoryService);
//# sourceMappingURL=class-category.service.js.map