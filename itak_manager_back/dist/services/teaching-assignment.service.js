"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeachingAssignmentService = void 0;
const common_1 = require("@nestjs/common");
const supabase_config_1 = require("../config/supabase.config");
let TeachingAssignmentService = class TeachingAssignmentService {
    tableName = 'teaching_assignments';
    async createTeachingAssignment(createTeachingAssignmentDto) {
        try {
            const { data: teacherData, error: teacherError } = await supabase_config_1.supabase
                .from('teachers')
                .select('id')
                .eq('id', createTeachingAssignmentDto.teacher_id)
                .single();
            if (teacherError || !teacherData) {
                throw new common_1.NotFoundException('Professeur non trouvé');
            }
            const { data: classSubjectData, error: classSubjectError } = await supabase_config_1.supabase
                .from('class_subjects')
                .select('id')
                .eq('id', createTeachingAssignmentDto.class_subject_id)
                .single();
            if (classSubjectError || !classSubjectData) {
                throw new common_1.NotFoundException('Association classe-matière non trouvée');
            }
            const { data: existingAssignment } = await supabase_config_1.supabase
                .from(this.tableName)
                .select('id')
                .eq('teacher_id', createTeachingAssignmentDto.teacher_id)
                .eq('class_subject_id', createTeachingAssignmentDto.class_subject_id)
                .single();
            if (existingAssignment) {
                throw new common_1.ConflictException('Ce professeur est déjà assigné à cette classe-matière');
            }
            const { data: newAssignment, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .insert(createTeachingAssignmentDto)
                .select()
                .single();
            if (error) {
                throw new Error(`Erreur lors de la création de l'assignation: ${error.message}`);
            }
            return this.mapToTeachingAssignmentResponse(newAssignment);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new Error(`Erreur lors de la création de l'assignation: ${error.message}`);
        }
    }
    async getAllTeachingAssignments() {
        try {
            const { data: assignments, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .select(`
          *,
          teacher:teachers(id, first_name, last_name),
          class_subject:class_subjects(
            id,
            class:classes(id, name, level),
            subject:subjects(id, name, code),
            coefficient,
            weekly_hours
          )
        `)
                .order('teacher_id', { ascending: true });
            if (error) {
                throw new Error(`Erreur lors de la récupération des assignations: ${error.message}`);
            }
            return assignments.map((assignment) => this.mapToTeachingAssignmentResponse(assignment));
        }
        catch (error) {
            throw new Error(`Erreur lors de la récupération des assignations: ${error.message}`);
        }
    }
    async getTeachingAssignmentById(id) {
        try {
            const { data: assignment, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .select(`
          *,
          teacher:teachers(id, first_name, last_name),
          class_subject:class_subjects(
            id,
            class:classes(id, name, level),
            subject:subjects(id, name, code),
            coefficient,
            weekly_hours
          )
        `)
                .eq('id', id)
                .single();
            if (error || !assignment) {
                throw new common_1.NotFoundException('Assignation non trouvée');
            }
            return this.mapToTeachingAssignmentResponse(assignment);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Erreur lors de la récupération de l'assignation: ${error.message}`);
        }
    }
    async getTeachingAssignmentsByTeacher(teacherId) {
        try {
            const { data: assignments, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .select(`
          *,
          teacher:teachers(id, first_name, last_name),
          class_subject:class_subjects(
            id,
            class:classes(id, name, level),
            subject:subjects(id, name, code),
            coefficient,
            weekly_hours
          )
        `)
                .eq('teacher_id', teacherId)
                .order('start_date', { ascending: false });
            if (error) {
                throw new Error(`Erreur lors de la récupération des assignations du professeur: ${error.message}`);
            }
            return assignments.map((assignment) => this.mapToTeachingAssignmentResponse(assignment));
        }
        catch (error) {
            throw new Error(`Erreur lors de la récupération des assignations du professeur: ${error.message}`);
        }
    }
    async getTeachingAssignmentsByClassSubject(classSubjectId) {
        try {
            const { data: assignments, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .select(`
          *,
          teacher:teachers(id, first_name, last_name),
          class_subject:class_subjects(
            id,
            class:classes(id, name, level),
            subject:subjects(id, name, code),
            coefficient,
            weekly_hours
          )
        `)
                .eq('class_subject_id', classSubjectId)
                .order('start_date', { ascending: false });
            if (error) {
                throw new Error(`Erreur lors de la récupération des assignations pour cette classe-matière: ${error.message}`);
            }
            return assignments.map((assignment) => this.mapToTeachingAssignmentResponse(assignment));
        }
        catch (error) {
            throw new Error(`Erreur lors de la récupération des assignations pour cette classe-matière: ${error.message}`);
        }
    }
    async updateTeachingAssignment(id, updateTeachingAssignmentDto) {
        try {
            await this.getTeachingAssignmentById(id);
            if (updateTeachingAssignmentDto.teacher_id) {
                const { data: teacherData, error: teacherError } = await supabase_config_1.supabase
                    .from('teachers')
                    .select('id')
                    .eq('id', updateTeachingAssignmentDto.teacher_id)
                    .single();
                if (teacherError || !teacherData) {
                    throw new common_1.NotFoundException('Professeur non trouvé');
                }
            }
            if (updateTeachingAssignmentDto.class_subject_id) {
                const { data: classSubjectData, error: classSubjectError } = await supabase_config_1.supabase
                    .from('class_subjects')
                    .select('id')
                    .eq('id', updateTeachingAssignmentDto.class_subject_id)
                    .single();
                if (classSubjectError || !classSubjectData) {
                    throw new common_1.NotFoundException('Association classe-matière non trouvée');
                }
            }
            if (updateTeachingAssignmentDto.teacher_id ||
                updateTeachingAssignmentDto.class_subject_id) {
                const currentAssignment = await this.getTeachingAssignmentById(id);
                const newTeacherId = updateTeachingAssignmentDto.teacher_id ||
                    currentAssignment.teacher_id;
                const newClassSubjectId = updateTeachingAssignmentDto.class_subject_id ||
                    currentAssignment.class_subject_id;
                const { data: existingAssignment } = await supabase_config_1.supabase
                    .from(this.tableName)
                    .select('id')
                    .eq('teacher_id', newTeacherId)
                    .eq('class_subject_id', newClassSubjectId)
                    .neq('id', id)
                    .single();
                if (existingAssignment) {
                    throw new common_1.ConflictException('Ce professeur est déjà assigné à cette classe-matière');
                }
            }
            const { data: updatedAssignment, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .update(updateTeachingAssignmentDto)
                .eq('id', id)
                .select(`
          *,
          teacher:teachers(id, first_name, last_name),
          class_subject:class_subjects(
            id,
            class:classes(id, name, level),
            subject:subjects(id, name, code),
            coefficient,
            weekly_hours
          )
        `)
                .single();
            if (error) {
                throw new Error(`Erreur lors de la mise à jour: ${error.message}`);
            }
            return this.mapToTeachingAssignmentResponse(updatedAssignment);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new Error(`Erreur lors de la mise à jour de l'assignation: ${error.message}`);
        }
    }
    async deleteTeachingAssignment(id) {
        try {
            await this.getTeachingAssignmentById(id);
            const { error } = await supabase_config_1.supabase
                .from(this.tableName)
                .delete()
                .eq('id', id);
            if (error) {
                throw new Error(`Erreur lors de la suppression: ${error.message}`);
            }
            return { message: 'Assignation supprimée avec succès' };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Erreur lors de la suppression de l'assignation: ${error.message}`);
        }
    }
    mapToTeachingAssignmentResponse(assignment) {
        return {
            id: assignment.id,
            teacher_id: assignment.teacher_id,
            class_subject_id: assignment.class_subject_id,
            start_date: assignment.start_date,
            end_date: assignment.end_date,
            created_at: assignment.created_at,
            teacher: assignment.teacher
                ? {
                    id: assignment.teacher.id,
                    first_name: assignment.teacher.first_name,
                    last_name: assignment.teacher.last_name,
                }
                : undefined,
            class_subject: assignment.class_subject
                ? {
                    id: assignment.class_subject.id,
                    class: assignment.class_subject.class
                        ? {
                            id: assignment.class_subject.class.id,
                            name: assignment.class_subject.class.name,
                            level: assignment.class_subject.class.level,
                        }
                        : undefined,
                    subject: assignment.class_subject.subject
                        ? {
                            id: assignment.class_subject.subject.id,
                            name: assignment.class_subject.subject.name,
                            code: assignment.class_subject.subject.code,
                        }
                        : undefined,
                    coefficient: assignment.class_subject.coefficient,
                    weekly_hours: assignment.class_subject.weekly_hours,
                }
                : undefined,
        };
    }
};
exports.TeachingAssignmentService = TeachingAssignmentService;
exports.TeachingAssignmentService = TeachingAssignmentService = __decorate([
    (0, common_1.Injectable)()
], TeachingAssignmentService);
//# sourceMappingURL=teaching-assignment.service.js.map