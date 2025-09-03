"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassService = void 0;
const common_1 = require("@nestjs/common");
const supabase_config_1 = require("../config/supabase.config");
let ClassService = class ClassService {
    tableName = 'classes';
    async createClass(createClassDto) {
        try {
            const { data: category, error: categoryError } = await supabase_config_1.supabase
                .from('class_category')
                .select('id')
                .eq('id', createClassDto.categorie_id)
                .single();
            if (categoryError || !category) {
                throw new common_1.NotFoundException('Catégorie non trouvée');
            }
            const { data: existingClass } = await supabase_config_1.supabase
                .from(this.tableName)
                .select('id')
                .eq('name', createClassDto.name)
                .eq('categorie_id', createClassDto.categorie_id)
                .single();
            if (existingClass) {
                throw new common_1.ConflictException('Une classe avec ce nom existe déjà dans cette catégorie');
            }
            const { data: newClass, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .insert(createClassDto)
                .select()
                .single();
            if (error) {
                throw new Error(`Erreur lors de la création de la classe: ${error.message}`);
            }
            return this.mapToClassResponse(newClass);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new Error(`Erreur lors de la création de la classe: ${error.message}`);
        }
    }
    async getAllClasses() {
        try {
            const { data: classes, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .select(`
          *,
          category:class_category(id, name)
        `)
                .order('name', { ascending: true });
            if (error) {
                throw new Error(`Erreur lors de la récupération des classes: ${error.message}`);
            }
            return classes.map((classItem) => this.mapToClassResponse(classItem));
        }
        catch (error) {
            throw new Error(`Erreur lors de la récupération des classes: ${error.message}`);
        }
    }
    async getClassById(id) {
        try {
            const { data: classItem, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .select(`
          *,
          category:class_category(id, name)
        `)
                .eq('id', id)
                .single();
            if (error || !classItem) {
                throw new common_1.NotFoundException('Classe non trouvée');
            }
            return this.mapToClassResponse(classItem);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Erreur lors de la récupération de la classe: ${error.message}`);
        }
    }
    async getClassesByCategory(categoryId) {
        try {
            const { data: classes, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .select(`
          *,
          category:class_category(id, name)
        `)
                .eq('categorie_id', categoryId)
                .order('name', { ascending: true });
            if (error) {
                throw new Error(`Erreur lors de la récupération des classes: ${error.message}`);
            }
            return classes.map((classItem) => this.mapToClassResponse(classItem));
        }
        catch (error) {
            throw new Error(`Erreur lors de la récupération des classes: ${error.message}`);
        }
    }
    async getClassesByLevel(level) {
        try {
            const { data: classes, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .select(`
          *,
          category:class_category(id, name)
        `)
                .ilike('level', `%${level}%`)
                .order('name', { ascending: true });
            if (error) {
                throw new Error(`Erreur lors de la récupération des classes: ${error.message}`);
            }
            return classes.map((classItem) => this.mapToClassResponse(classItem));
        }
        catch (error) {
            throw new Error(`Erreur lors de la récupération des classes: ${error.message}`);
        }
    }
    async updateClass(id, updateClassDto) {
        try {
            await this.getClassById(id);
            if (updateClassDto.categorie_id) {
                const { data: category, error: categoryError } = await supabase_config_1.supabase
                    .from('class_category')
                    .select('id')
                    .eq('id', updateClassDto.categorie_id)
                    .single();
                if (categoryError || !category) {
                    throw new common_1.NotFoundException('Catégorie non trouvée');
                }
            }
            if (updateClassDto.name) {
                const currentClass = await this.getClassById(id);
                const categoryId = updateClassDto.categorie_id || currentClass.categorie_id;
                const { data: existingClass } = await supabase_config_1.supabase
                    .from(this.tableName)
                    .select('id')
                    .eq('name', updateClassDto.name)
                    .eq('categorie_id', categoryId)
                    .neq('id', id)
                    .single();
                if (existingClass) {
                    throw new common_1.ConflictException('Une classe avec ce nom existe déjà dans cette catégorie');
                }
            }
            const { data: updatedClass, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .update(updateClassDto)
                .eq('id', id)
                .select(`
          *,
          category:class_category(id, name)
        `)
                .single();
            if (error) {
                throw new Error(`Erreur lors de la mise à jour: ${error.message}`);
            }
            return this.mapToClassResponse(updatedClass);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new Error(`Erreur lors de la mise à jour de la classe: ${error.message}`);
        }
    }
    async deleteClass(id) {
        try {
            await this.getClassById(id);
            const { error } = await supabase_config_1.supabase
                .from(this.tableName)
                .delete()
                .eq('id', id);
            if (error) {
                throw new Error(`Erreur lors de la suppression: ${error.message}`);
            }
            return { message: 'Classe supprimée avec succès' };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Erreur lors de la suppression de la classe: ${error.message}`);
        }
    }
    mapToClassResponse(classItem) {
        return {
            id: classItem.id,
            name: classItem.name,
            level: classItem.level,
            capacity: classItem.capacity,
            categorie_id: classItem.categorie_id,
            created_at: classItem.created_at,
            category: classItem.category
                ? {
                    id: classItem.category.id,
                    name: classItem.category.name,
                }
                : undefined,
        };
    }
};
exports.ClassService = ClassService;
exports.ClassService = ClassService = __decorate([
    (0, common_1.Injectable)()
], ClassService);
//# sourceMappingURL=class.service.js.map