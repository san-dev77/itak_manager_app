"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectService = void 0;
const common_1 = require("@nestjs/common");
const supabase_config_1 = require("../config/supabase.config");
let SubjectService = class SubjectService {
    tableName = 'subjects';
    async createSubject(createSubjectDto) {
        try {
            const { data: category, error: categoryError } = await supabase_config_1.supabase
                .from('class_category')
                .select('id')
                .eq('id', createSubjectDto.categorie_id)
                .single();
            if (categoryError || !category) {
                throw new common_1.NotFoundException('Catégorie non trouvée');
            }
            const { data: existingSubject } = await supabase_config_1.supabase
                .from(this.tableName)
                .select('id')
                .eq('code', createSubjectDto.code)
                .single();
            if (existingSubject) {
                throw new common_1.ConflictException('Une matière avec ce code existe déjà');
            }
            const { data: existingSubjectName } = await supabase_config_1.supabase
                .from(this.tableName)
                .select('id')
                .eq('name', createSubjectDto.name)
                .single();
            if (existingSubjectName) {
                throw new common_1.ConflictException('Une matière avec ce nom existe déjà');
            }
            const { data: newSubject, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .insert(createSubjectDto)
                .select()
                .single();
            if (error) {
                throw new Error(`Erreur lors de la création de la matière: ${error.message}`);
            }
            return this.mapToSubjectResponse(newSubject);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new Error(`Erreur lors de la création de la matière: ${error.message}`);
        }
    }
    async getAllSubjects() {
        try {
            const { data: subjects, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .select(`
          *,
          category:class_category(id, name)
        `)
                .order('name', { ascending: true });
            if (error) {
                throw new Error(`Erreur lors de la récupération des matières: ${error.message}`);
            }
            return subjects.map((subject) => this.mapToSubjectResponse(subject));
        }
        catch (error) {
            throw new Error(`Erreur lors de la récupération des matières: ${error.message}`);
        }
    }
    async getSubjectById(id) {
        try {
            const { data: subject, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .select('*')
                .eq('id', id)
                .single();
            if (error || !subject) {
                throw new common_1.NotFoundException('Matière non trouvée');
            }
            return this.mapToSubjectResponse(subject);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Erreur lors de la récupération de la matière: ${error.message}`);
        }
    }
    async getSubjectByCode(code) {
        try {
            const { data: subject, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .select('*')
                .eq('code', code)
                .single();
            if (error || !subject) {
                throw new common_1.NotFoundException('Matière non trouvée');
            }
            return this.mapToSubjectResponse(subject);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Erreur lors de la récupération de la matière: ${error.message}`);
        }
    }
    async getSubjectsByName(name) {
        try {
            const { data: subjects, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .select('*')
                .ilike('name', `%${name}%`)
                .order('name', { ascending: true });
            if (error) {
                throw new Error(`Erreur lors de la récupération des matières: ${error.message}`);
            }
            return subjects.map((subject) => this.mapToSubjectResponse(subject));
        }
        catch (error) {
            throw new Error(`Erreur lors de la récupération des matières: ${error.message}`);
        }
    }
    async getSubjectsByCategory(categoryId) {
        try {
            const { data: subjects, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .select(`
          *,
          category:class_category(id, name)
        `)
                .eq('categorie_id', categoryId)
                .order('name', { ascending: true });
            if (error) {
                throw new Error(`Erreur lors de la récupération des matières: ${error.message}`);
            }
            return subjects.map((subject) => this.mapToSubjectResponse(subject));
        }
        catch (error) {
            throw new Error(`Erreur lors de la récupération des matières: ${error.message}`);
        }
    }
    async updateSubject(id, updateSubjectDto) {
        try {
            await this.getSubjectById(id);
            if (updateSubjectDto.code) {
                const { data: existingSubject } = await supabase_config_1.supabase
                    .from(this.tableName)
                    .select('id')
                    .eq('code', updateSubjectDto.code)
                    .neq('id', id)
                    .single();
                if (existingSubject) {
                    throw new common_1.ConflictException('Une matière avec ce code existe déjà');
                }
            }
            if (updateSubjectDto.name) {
                const { data: existingSubjectName } = await supabase_config_1.supabase
                    .from(this.tableName)
                    .select('id')
                    .eq('name', updateSubjectDto.name)
                    .neq('id', id)
                    .single();
                if (existingSubjectName) {
                    throw new common_1.ConflictException('Une matière avec ce nom existe déjà');
                }
            }
            const { data: updatedSubject, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .update(updateSubjectDto)
                .eq('id', id)
                .select()
                .single();
            if (error) {
                throw new Error(`Erreur lors de la mise à jour: ${error.message}`);
            }
            return this.mapToSubjectResponse(updatedSubject);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new Error(`Erreur lors de la mise à jour de la matière: ${error.message}`);
        }
    }
    async deleteSubject(id) {
        try {
            await this.getSubjectById(id);
            const { error } = await supabase_config_1.supabase
                .from(this.tableName)
                .delete()
                .eq('id', id);
            if (error) {
                throw new Error(`Erreur lors de la suppression: ${error.message}`);
            }
            return { message: 'Matière supprimée avec succès' };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Erreur lors de la suppression de la matière: ${error.message}`);
        }
    }
    mapToSubjectResponse(subject) {
        return {
            id: subject.id,
            name: subject.name,
            code: subject.code,
            categorie_id: subject.categorie_id,
            created_at: subject.created_at,
            category: subject.category
                ? {
                    id: subject.category.id,
                    name: subject.category.name,
                }
                : undefined,
        };
    }
};
exports.SubjectService = SubjectService;
exports.SubjectService = SubjectService = __decorate([
    (0, common_1.Injectable)()
], SubjectService);
//# sourceMappingURL=subject.service.js.map