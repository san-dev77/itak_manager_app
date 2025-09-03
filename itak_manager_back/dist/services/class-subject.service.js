"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassSubjectService = void 0;
const common_1 = require("@nestjs/common");
const supabase_config_1 = require("../config/supabase.config");
let ClassSubjectService = class ClassSubjectService {
    tableName = 'class_subjects';
    async createClassSubject(createClassSubjectDto) {
        try {
            const { data: classData, error: classError } = await supabase_config_1.supabase
                .from('classes')
                .select('id')
                .eq('id', createClassSubjectDto.class_id)
                .single();
            if (classError || !classData) {
                throw new common_1.NotFoundException('Classe non trouvée');
            }
            const { data: subjectData, error: subjectError } = await supabase_config_1.supabase
                .from('subjects')
                .select('id')
                .eq('id', createClassSubjectDto.subject_id)
                .single();
            if (subjectError || !subjectData) {
                throw new common_1.NotFoundException('Matière non trouvée');
            }
            const { data: existingClassSubject } = await supabase_config_1.supabase
                .from(this.tableName)
                .select('id')
                .eq('class_id', createClassSubjectDto.class_id)
                .eq('subject_id', createClassSubjectDto.subject_id)
                .single();
            if (existingClassSubject) {
                throw new common_1.ConflictException('Cette matière est déjà associée à cette classe');
            }
            const { data: newClassSubject, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .insert(createClassSubjectDto)
                .select()
                .single();
            if (error) {
                throw new Error(`Erreur lors de la création de l'association classe-matière: ${error.message}`);
            }
            return this.mapToClassSubjectResponse(newClassSubject);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new Error(`Erreur lors de la création de l'association classe-matière: ${error.message}`);
        }
    }
    async getAllClassSubjects() {
        try {
            const { data: classSubjects, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .select(`
          *,
          class:classes(id, name, level),
          subject:subjects(id, name, code)
        `)
                .order('class_id', { ascending: true });
            if (error) {
                throw new Error(`Erreur lors de la récupération des associations classe-matière: ${error.message}`);
            }
            return classSubjects.map((classSubject) => this.mapToClassSubjectResponse(classSubject));
        }
        catch (error) {
            throw new Error(`Erreur lors de la récupération des associations classe-matière: ${error.message}`);
        }
    }
    async getClassSubjectById(id) {
        try {
            const { data: classSubject, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .select(`
          *,
          class:classes(id, name, level),
          subject:subjects(id, name, code)
        `)
                .eq('id', id)
                .single();
            if (error || !classSubject) {
                throw new common_1.NotFoundException('Association classe-matière non trouvée');
            }
            return this.mapToClassSubjectResponse(classSubject);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Erreur lors de la récupération de l'association classe-matière: ${error.message}`);
        }
    }
    async getClassSubjectsByClass(classId) {
        try {
            const { data: classSubjects, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .select(`
          *,
          class:classes(id, name, level),
          subject:subjects(id, name, code)
        `)
                .eq('class_id', classId)
                .order('subject_id', { ascending: true });
            if (error) {
                throw new Error(`Erreur lors de la récupération des matières de la classe: ${error.message}`);
            }
            return classSubjects.map((classSubject) => this.mapToClassSubjectResponse(classSubject));
        }
        catch (error) {
            throw new Error(`Erreur lors de la récupération des matières de la classe: ${error.message}`);
        }
    }
    async getClassSubjectsBySubject(subjectId) {
        try {
            const { data: classSubjects, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .select(`
          *,
          class:classes(id, name, level),
          subject:subjects(id, name, code)
        `)
                .eq('subject_id', subjectId)
                .order('class_id', { ascending: true });
            if (error) {
                throw new Error(`Erreur lors de la récupération des classes pour cette matière: ${error.message}`);
            }
            return classSubjects.map((classSubject) => this.mapToClassSubjectResponse(classSubject));
        }
        catch (error) {
            throw new Error(`Erreur lors de la récupération des classes pour cette matière: ${error.message}`);
        }
    }
    async updateClassSubject(id, updateClassSubjectDto) {
        try {
            await this.getClassSubjectById(id);
            if (updateClassSubjectDto.class_id) {
                const { data: classData, error: classError } = await supabase_config_1.supabase
                    .from('classes')
                    .select('id')
                    .eq('id', updateClassSubjectDto.class_id)
                    .single();
                if (classError || !classData) {
                    throw new common_1.NotFoundException('Classe non trouvée');
                }
            }
            if (updateClassSubjectDto.subject_id) {
                const { data: subjectData, error: subjectError } = await supabase_config_1.supabase
                    .from('subjects')
                    .select('id')
                    .eq('id', updateClassSubjectDto.subject_id)
                    .single();
                if (subjectError || !subjectData) {
                    throw new common_1.NotFoundException('Matière non trouvée');
                }
            }
            if (updateClassSubjectDto.class_id || updateClassSubjectDto.subject_id) {
                const currentClassSubject = await this.getClassSubjectById(id);
                const newClassId = updateClassSubjectDto.class_id || currentClassSubject.class_id;
                const newSubjectId = updateClassSubjectDto.subject_id || currentClassSubject.subject_id;
                const { data: existingClassSubject } = await supabase_config_1.supabase
                    .from(this.tableName)
                    .select('id')
                    .eq('class_id', newClassId)
                    .eq('subject_id', newSubjectId)
                    .neq('id', id)
                    .single();
                if (existingClassSubject) {
                    throw new common_1.ConflictException('Cette matière est déjà associée à cette classe');
                }
            }
            const { data: updatedClassSubject, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .update(updateClassSubjectDto)
                .eq('id', id)
                .select(`
          *,
          class:classes(id, name, level),
          subject:subjects(id, name, code)
        `)
                .single();
            if (error) {
                throw new Error(`Erreur lors de la mise à jour: ${error.message}`);
            }
            return this.mapToClassSubjectResponse(updatedClassSubject);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new Error(`Erreur lors de la mise à jour de l'association classe-matière: ${error.message}`);
        }
    }
    async deleteClassSubject(id) {
        try {
            await this.getClassSubjectById(id);
            const { error } = await supabase_config_1.supabase
                .from(this.tableName)
                .delete()
                .eq('id', id);
            if (error) {
                throw new Error(`Erreur lors de la suppression: ${error.message}`);
            }
            return { message: 'Association classe-matière supprimée avec succès' };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Erreur lors de la suppression de l'association classe-matière: ${error.message}`);
        }
    }
    mapToClassSubjectResponse(classSubject) {
        return {
            id: classSubject.id,
            class_id: classSubject.class_id,
            subject_id: classSubject.subject_id,
            coefficient: classSubject.coefficient,
            weekly_hours: classSubject.weekly_hours,
            is_optional: classSubject.is_optional,
            created_at: classSubject.created_at,
            class: classSubject.class
                ? {
                    id: classSubject.class.id,
                    name: classSubject.class.name,
                    level: classSubject.class.level,
                }
                : undefined,
            subject: classSubject.subject
                ? {
                    id: classSubject.subject.id,
                    name: classSubject.subject.name,
                    code: classSubject.subject.code,
                }
                : undefined,
        };
    }
};
exports.ClassSubjectService = ClassSubjectService;
exports.ClassSubjectService = ClassSubjectService = __decorate([
    (0, common_1.Injectable)()
], ClassSubjectService);
//# sourceMappingURL=class-subject.service.js.map