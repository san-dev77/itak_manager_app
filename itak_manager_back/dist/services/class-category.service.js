"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassCategoryService = void 0;
const common_1 = require("@nestjs/common");
const supabase_config_1 = require("../config/supabase.config");
let ClassCategoryService = class ClassCategoryService {
    tableName = 'class_category';
    async createClassCategory(createClassCategoryDto) {
        try {
            const { data: existingCategory } = await supabase_config_1.supabase
                .from(this.tableName)
                .select('id')
                .eq('name', createClassCategoryDto.name)
                .single();
            if (existingCategory) {
                throw new common_1.ConflictException('Une catégorie avec ce nom existe déjà');
            }
            const { data: newCategory, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .insert(createClassCategoryDto)
                .select()
                .single();
            if (error) {
                throw new Error(`Erreur lors de la création de la catégorie: ${error.message}`);
            }
            return this.mapToClassCategoryResponse(newCategory);
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new Error(`Erreur lors de la création de la catégorie: ${error.message}`);
        }
    }
    async getAllClassCategories() {
        try {
            const { data: categories, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .select('*')
                .order('name', { ascending: true });
            if (error) {
                throw new Error(`Erreur lors de la récupération des catégories: ${error.message}`);
            }
            return categories.map((category) => this.mapToClassCategoryResponse(category));
        }
        catch (error) {
            throw new Error(`Erreur lors de la récupération des catégories: ${error.message}`);
        }
    }
    async getClassCategoryById(id) {
        try {
            const { data: category, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .select('*')
                .eq('id', id)
                .single();
            if (error || !category) {
                throw new common_1.NotFoundException('Catégorie non trouvée');
            }
            return this.mapToClassCategoryResponse(category);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Erreur lors de la récupération de la catégorie: ${error.message}`);
        }
    }
    async updateClassCategory(id, updateClassCategoryDto) {
        try {
            await this.getClassCategoryById(id);
            if (updateClassCategoryDto.name) {
                const { data: existingCategory } = await supabase_config_1.supabase
                    .from(this.tableName)
                    .select('id')
                    .eq('name', updateClassCategoryDto.name)
                    .neq('id', id)
                    .single();
                if (existingCategory) {
                    throw new common_1.ConflictException('Une catégorie avec ce nom existe déjà');
                }
            }
            const { data: updatedCategory, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .update(updateClassCategoryDto)
                .eq('id', id)
                .select()
                .single();
            if (error) {
                throw new Error(`Erreur lors de la mise à jour: ${error.message}`);
            }
            return this.mapToClassCategoryResponse(updatedCategory);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new Error(`Erreur lors de la mise à jour de la catégorie: ${error.message}`);
        }
    }
    async deleteClassCategory(id) {
        try {
            await this.getClassCategoryById(id);
            const { data: classesUsingCategory } = await supabase_config_1.supabase
                .from('classes')
                .select('id')
                .eq('categorie_id', id)
                .limit(1);
            if (classesUsingCategory && classesUsingCategory.length > 0) {
                throw new common_1.ConflictException('Impossible de supprimer cette catégorie car elle est utilisée par des classes');
            }
            const { error } = await supabase_config_1.supabase
                .from(this.tableName)
                .delete()
                .eq('id', id);
            if (error) {
                throw new Error(`Erreur lors de la suppression: ${error.message}`);
            }
            return { message: 'Catégorie supprimée avec succès' };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new Error(`Erreur lors de la suppression de la catégorie: ${error.message}`);
        }
    }
    async initializeDefaultCategories() {
        try {
            const defaultCategories = [{ name: 'Collège' }, { name: 'Faculté' }];
            for (const category of defaultCategories) {
                const { data: existingCategory } = await supabase_config_1.supabase
                    .from(this.tableName)
                    .select('id')
                    .eq('name', category.name)
                    .single();
                if (!existingCategory) {
                    await supabase_config_1.supabase.from(this.tableName).insert(category);
                }
            }
        }
        catch (error) {
            console.log('Catégories par défaut déjà initialisées ou erreur:', error.message);
        }
    }
    mapToClassCategoryResponse(category) {
        return {
            id: category.id,
            name: category.name,
            created_at: category.created_at,
        };
    }
};
exports.ClassCategoryService = ClassCategoryService;
exports.ClassCategoryService = ClassCategoryService = __decorate([
    (0, common_1.Injectable)()
], ClassCategoryService);
//# sourceMappingURL=class-category.service.js.map