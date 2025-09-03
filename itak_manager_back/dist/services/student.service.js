"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentService = void 0;
const common_1 = require("@nestjs/common");
const supabase_config_1 = require("../config/supabase.config");
let StudentService = class StudentService {
    tableName = 'students';
    async createStudent(createStudentDto) {
        try {
            const { data: user, error: userError } = await supabase_config_1.supabase
                .from('users')
                .select('id, role')
                .eq('id', createStudentDto.user_id)
                .single();
            if (userError || !user) {
                throw new common_1.NotFoundException('Utilisateur non trouvé');
            }
            if (user.role !== 'student') {
                throw new common_1.ConflictException('Seuls les utilisateurs avec le rôle "student" peuvent être des étudiants');
            }
            const { data: existingMatricule } = await supabase_config_1.supabase
                .from(this.tableName)
                .select('id')
                .eq('matricule', createStudentDto.matricule)
                .single();
            if (existingMatricule) {
                throw new common_1.ConflictException('Un étudiant avec ce matricule existe déjà');
            }
            const { data: existingStudent } = await supabase_config_1.supabase
                .from(this.tableName)
                .select('id')
                .eq('user_id', createStudentDto.user_id)
                .single();
            if (existingStudent) {
                throw new common_1.ConflictException('Cet utilisateur est déjà un étudiant');
            }
            const { data: newStudent, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .insert(createStudentDto)
                .select()
                .single();
            if (error) {
                throw new Error(`Erreur lors de la création de l'étudiant: ${error.message}`);
            }
            return this.mapToStudentResponse(newStudent);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new Error(`Erreur lors de la création de l'étudiant: ${error.message}`);
        }
    }
    async getAllStudents() {
        try {
            const { data: students, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .select(`
          *,
          user:users(id, username, email, first_name, last_name, role)
        `)
                .order('id', { ascending: false });
            if (error) {
                throw new Error(`Erreur lors de la récupération des étudiants: ${error.message}`);
            }
            return students.map((student) => this.mapToStudentResponse(student));
        }
        catch (error) {
            throw new Error(`Erreur lors de la récupération des étudiants: ${error.message}`);
        }
    }
    async getStudentById(id) {
        try {
            const { data: student, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .select(`
          *,
          user:users(id, username, email, first_name, last_name, role)
        `)
                .eq('id', id)
                .single();
            if (error || !student) {
                throw new common_1.NotFoundException('Étudiant non trouvé');
            }
            return this.mapToStudentResponse(student);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Erreur lors de la récupération de l'étudiant: ${error.message}`);
        }
    }
    async getStudentByUserId(userId) {
        try {
            const { data: student, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .select(`
          *,
          user:users(id, username, email, first_name, last_name, role)
        `)
                .eq('user_id', userId)
                .single();
            if (error || !student) {
                throw new common_1.NotFoundException('Étudiant non trouvé');
            }
            return this.mapToStudentResponse(student);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Erreur lors de la récupération de l'étudiant: ${error.message}`);
        }
    }
    async getStudentByMatricule(matricule) {
        try {
            const { data: student, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .select(`
          *,
          user:users(id, username, email, first_name, last_name, role)
        `)
                .eq('matricule', matricule)
                .single();
            if (error || !student) {
                throw new common_1.NotFoundException('Étudiant non trouvé');
            }
            return this.mapToStudentResponse(student);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Erreur lors de la récupération de l'étudiant: ${error.message}`);
        }
    }
    async updateStudent(id, updateStudentDto) {
        try {
            await this.getStudentById(id);
            if (updateStudentDto.matricule) {
                const { data: existingMatricule } = await supabase_config_1.supabase
                    .from(this.tableName)
                    .select('id')
                    .eq('matricule', updateStudentDto.matricule)
                    .neq('id', id)
                    .single();
                if (existingMatricule) {
                    throw new common_1.ConflictException('Un étudiant avec ce matricule existe déjà');
                }
            }
            const { data: updatedStudent, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .update(updateStudentDto)
                .eq('id', id)
                .select(`
          *,
          user:users(id, username, email, first_name, last_name, role)
        `)
                .single();
            if (error) {
                throw new Error(`Erreur lors de la mise à jour: ${error.message}`);
            }
            return this.mapToStudentResponse(updatedStudent);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new Error(`Erreur lors de la mise à jour de l'étudiant: ${error.message}`);
        }
    }
    async deleteStudent(id) {
        try {
            await this.getStudentById(id);
            const { error } = await supabase_config_1.supabase
                .from(this.tableName)
                .delete()
                .eq('id', id);
            if (error) {
                throw new Error(`Erreur lors de la suppression: ${error.message}`);
            }
            return { message: 'Étudiant supprimé avec succès' };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Erreur lors de la suppression de l'étudiant: ${error.message}`);
        }
    }
    mapToStudentResponse(student) {
        return {
            id: student.id,
            user_id: student.user_id,
            matricule: student.matricule,
            enrollment_date: student.enrollment_date,
            photo: student.photo,
            marital_status: student.marital_status,
            father_name: student.father_name,
            mother_name: student.mother_name,
            tutor_name: student.tutor_name,
            tutor_phone: student.tutor_phone,
            address: student.address,
            emergency_contact: student.emergency_contact,
            notes: student.notes,
            user: student.user
                ? {
                    id: student.user.id,
                    username: student.user.username,
                    email: student.user.email,
                    first_name: student.user.first_name,
                    last_name: student.user.last_name,
                    role: student.user.role,
                }
                : undefined,
        };
    }
};
exports.StudentService = StudentService;
exports.StudentService = StudentService = __decorate([
    (0, common_1.Injectable)()
], StudentService);
//# sourceMappingURL=student.service.js.map