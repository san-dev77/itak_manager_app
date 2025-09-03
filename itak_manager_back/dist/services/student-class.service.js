"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentClassService = void 0;
const common_1 = require("@nestjs/common");
const supabase_config_1 = require("../config/supabase.config");
let StudentClassService = class StudentClassService {
    tableName = 'student_classes';
    async createStudentClass(createStudentClassDto) {
        try {
            const { data: studentData, error: studentError } = await supabase_config_1.supabase
                .from('students')
                .select('id')
                .eq('id', createStudentClassDto.student_id)
                .single();
            if (studentError || !studentData) {
                throw new common_1.NotFoundException('Étudiant non trouvé');
            }
            const { data: classData, error: classError } = await supabase_config_1.supabase
                .from('classes')
                .select('id')
                .eq('id', createStudentClassDto.class_id)
                .single();
            if (classError || !classData) {
                throw new common_1.NotFoundException('Classe non trouvée');
            }
            const { data: existingStudentClass } = await supabase_config_1.supabase
                .from(this.tableName)
                .select('id')
                .eq('student_id', createStudentClassDto.student_id)
                .eq('class_id', createStudentClassDto.class_id)
                .single();
            if (existingStudentClass) {
                throw new common_1.ConflictException('Cet étudiant est déjà inscrit dans cette classe');
            }
            const { data: newStudentClass, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .insert(createStudentClassDto)
                .select()
                .single();
            if (error) {
                throw new Error(`Erreur lors de l'inscription de l'étudiant: ${error.message}`);
            }
            return this.mapToStudentClassResponse(newStudentClass);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new Error(`Erreur lors de l'inscription de l'étudiant: ${error.message}`);
        }
    }
    async getAllStudentClasses() {
        try {
            const { data: studentClasses, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .select(`
          *,
          student:students!inner(
            id,
            user:users!inner(first_name, last_name)
          ),
          class:classes(id, name, level)
        `)
                .order('student_id', { ascending: true });
            if (error) {
                throw new Error(`Erreur lors de la récupération des inscriptions: ${error.message}`);
            }
            return studentClasses.map((studentClass) => this.mapToStudentClassResponse(studentClass));
        }
        catch (error) {
            throw new Error(`Erreur lors de la récupération des inscriptions: ${error.message}`);
        }
    }
    async getStudentClassById(id) {
        try {
            const { data: studentClass, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .select(`
          *,
          student:students!inner(
            id,
            user:users!inner(first_name, last_name)
          ),
          class:classes(id, name, level)
        `)
                .eq('id', id)
                .single();
            if (error || !studentClass) {
                throw new common_1.NotFoundException('Inscription non trouvée');
            }
            return this.mapToStudentClassResponse(studentClass);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Erreur lors de la récupération de l'inscription: ${error.message}`);
        }
    }
    async getStudentClassesByStudent(studentId) {
        try {
            const { data: studentClasses, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .select(`
          *,
          student:students!inner(
            id,
            user:users!inner(first_name, last_name)
          ),
          class:classes(id, name, level)
        `)
                .eq('student_id', studentId)
                .order('start_date', { ascending: false });
            if (error) {
                throw new Error(`Erreur lors de la récupération des inscriptions de l'étudiant: ${error.message}`);
            }
            return studentClasses.map((studentClass) => this.mapToStudentClassResponse(studentClass));
        }
        catch (error) {
            throw new Error(`Erreur lors de la récupération des inscriptions de l'étudiant: ${error.message}`);
        }
    }
    async getStudentClassesByClass(classId) {
        try {
            const { data: studentClasses, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .select(`
          *,
          student:students!inner(
            id,
            user:users!inner(first_name, last_name)
          ),
          class:classes(id, name, level)
        `)
                .eq('class_id', classId)
                .order('start_date', { ascending: false });
            if (error) {
                throw new Error(`Erreur lors de la récupération des étudiants de la classe: ${error.message}`);
            }
            return studentClasses.map((studentClass) => this.mapToStudentClassResponse(studentClass));
        }
        catch (error) {
            throw new Error(`Erreur lors de la récupération des étudiants de la classe: ${error.message}`);
        }
    }
    async updateStudentClass(id, updateStudentClassDto) {
        try {
            await this.getStudentClassById(id);
            if (updateStudentClassDto.student_id) {
                const { data: studentData, error: studentError } = await supabase_config_1.supabase
                    .from('students')
                    .select('id')
                    .eq('id', updateStudentClassDto.student_id)
                    .single();
                if (studentError || !studentData) {
                    throw new common_1.NotFoundException('Étudiant non trouvé');
                }
            }
            if (updateStudentClassDto.class_id) {
                const { data: classData, error: classError } = await supabase_config_1.supabase
                    .from('classes')
                    .select('id')
                    .eq('id', updateStudentClassDto.class_id)
                    .single();
                if (classError || !classData) {
                    throw new common_1.NotFoundException('Classe non trouvée');
                }
            }
            if (updateStudentClassDto.student_id || updateStudentClassDto.class_id) {
                const currentStudentClass = await this.getStudentClassById(id);
                const newStudentId = updateStudentClassDto.student_id || currentStudentClass.student_id;
                const newClassId = updateStudentClassDto.class_id || currentStudentClass.class_id;
                const { data: existingStudentClass } = await supabase_config_1.supabase
                    .from(this.tableName)
                    .select('id')
                    .eq('student_id', newStudentId)
                    .eq('class_id', newClassId)
                    .neq('id', id)
                    .single();
                if (existingStudentClass) {
                    throw new common_1.ConflictException('Cet étudiant est déjà inscrit dans cette classe');
                }
            }
            const { data: updatedStudentClass, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .update(updateStudentClassDto)
                .eq('id', id)
                .select(`
          *,
          student:students!inner(
            id,
            user:users!inner(first_name, last_name)
          ),
          class:classes(id, level)
        `)
                .single();
            if (error) {
                throw new Error(`Erreur lors de la mise à jour: ${error.message}`);
            }
            return this.mapToStudentClassResponse(updatedStudentClass);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new Error(`Erreur lors de la mise à jour de l'inscription: ${error.message}`);
        }
    }
    async deleteStudentClass(id) {
        try {
            await this.getStudentClassById(id);
            const { error } = await supabase_config_1.supabase
                .from(this.tableName)
                .delete()
                .eq('id', id);
            if (error) {
                throw new Error(`Erreur lors de la suppression: ${error.message}`);
            }
            return { message: 'Inscription supprimée avec succès' };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Erreur lors de la suppression de l'inscription: ${error.message}`);
        }
    }
    mapToStudentClassResponse(studentClass) {
        return {
            id: studentClass.id,
            student_id: studentClass.student_id,
            class_id: studentClass.class_id,
            start_date: studentClass.start_date,
            end_date: studentClass.end_date,
            created_at: studentClass.created_at,
            student: studentClass.student
                ? {
                    id: studentClass.student.id,
                    first_name: studentClass.student.user?.first_name,
                    last_name: studentClass.student.user?.last_name,
                }
                : undefined,
            class: studentClass.class
                ? {
                    id: studentClass.class.id,
                    name: studentClass.class.name,
                    level: studentClass.class.level,
                }
                : undefined,
        };
    }
};
exports.StudentClassService = StudentClassService;
exports.StudentClassService = StudentClassService = __decorate([
    (0, common_1.Injectable)()
], StudentClassService);
//# sourceMappingURL=student-class.service.js.map