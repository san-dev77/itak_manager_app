"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherService = void 0;
const common_1 = require("@nestjs/common");
const supabase_config_1 = require("../config/supabase.config");
let TeacherService = class TeacherService {
    tableName = 'teachers';
    async createTeacher(createTeacherDto) {
        try {
            const { data: user, error: userError } = await supabase_config_1.supabase
                .from('users')
                .select('id, role')
                .eq('id', createTeacherDto.user_id)
                .single();
            if (userError || !user) {
                throw new common_1.NotFoundException('Utilisateur non trouvé');
            }
            if (user.role !== 'teacher') {
                throw new common_1.ConflictException('Seuls les utilisateurs avec le rôle "teacher" peuvent être des enseignants');
            }
            const { data: existingMatricule } = await supabase_config_1.supabase
                .from(this.tableName)
                .select('id')
                .eq('matricule', createTeacherDto.matricule)
                .single();
            if (existingMatricule) {
                throw new common_1.ConflictException('Un enseignant avec ce matricule existe déjà');
            }
            const { data: existingTeacher } = await supabase_config_1.supabase
                .from(this.tableName)
                .select('id')
                .eq('user_id', createTeacherDto.user_id)
                .single();
            if (existingTeacher) {
                throw new common_1.ConflictException('Cet utilisateur est déjà un enseignant');
            }
            const { data: newTeacher, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .insert(createTeacherDto)
                .select()
                .single();
            if (error) {
                throw new Error(`Erreur lors de la création de l'enseignant: ${error.message}`);
            }
            return this.mapToTeacherResponse(newTeacher);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new Error(`Erreur lors de la création de l'enseignant: ${error.message}`);
        }
    }
    async getAllTeachers() {
        try {
            const { data: teachers, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .select(`
          *,
          user:users(id, username, email, first_name, last_name, role)
        `)
                .order('id', { ascending: false });
            if (error) {
                throw new Error(`Erreur lors de la récupération des enseignants: ${error.message}`);
            }
            return teachers.map((teacher) => this.mapToTeacherResponse(teacher));
        }
        catch (error) {
            throw new Error(`Erreur lors de la récupération des enseignants: ${error.message}`);
        }
    }
    async getTeacherById(id) {
        try {
            const { data: teacher, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .select(`
          *,
          user:users(id, username, email, first_name, last_name, role)
        `)
                .eq('id', id)
                .single();
            if (error || !teacher) {
                throw new common_1.NotFoundException('Enseignant non trouvé');
            }
            return this.mapToTeacherResponse(teacher);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Erreur lors de la récupération de l'enseignant: ${error.message}`);
        }
    }
    async getTeacherByUserId(userId) {
        try {
            const { data: teacher, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .select(`
          *,
          user:users(id, username, email, first_name, last_name, role)
        `)
                .eq('user_id', userId)
                .single();
            if (error || !teacher) {
                throw new common_1.NotFoundException('Enseignant non trouvé');
            }
            return this.mapToTeacherResponse(teacher);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Erreur lors de la récupération de l'enseignant: ${error.message}`);
        }
    }
    async getTeacherByMatricule(matricule) {
        try {
            const { data: teacher, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .select(`
          *,
          user:users(id, username, email, first_name, last_name, role)
        `)
                .eq('matricule', matricule)
                .single();
            if (error || !teacher) {
                throw new common_1.NotFoundException('Enseignant non trouvé');
            }
            return this.mapToTeacherResponse(teacher);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Erreur lors de la récupération de l'enseignant: ${error.message}`);
        }
    }
    async getTeachersBySpecialty(specialty) {
        try {
            const { data: teachers, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .select(`
          *,
          user:users(id, username, email, first_name, last_name, role)
        `)
                .ilike('specialty', `%${specialty}%`)
                .order('id', { ascending: false });
            if (error) {
                throw new Error(`Erreur lors de la récupération des enseignants: ${error.message}`);
            }
            return teachers.map((teacher) => this.mapToTeacherResponse(teacher));
        }
        catch (error) {
            throw new Error(`Erreur lors de la récupération des enseignants: ${error.message}`);
        }
    }
    async updateTeacher(id, updateTeacherDto) {
        try {
            await this.getTeacherById(id);
            if (updateTeacherDto.matricule) {
                const { data: existingMatricule } = await supabase_config_1.supabase
                    .from(this.tableName)
                    .select('id')
                    .eq('matricule', updateTeacherDto.matricule)
                    .neq('id', id)
                    .single();
                if (existingMatricule) {
                    throw new common_1.ConflictException('Un enseignant avec ce matricule existe déjà');
                }
            }
            const { data: updatedTeacher, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .update(updateTeacherDto)
                .eq('id', id)
                .select(`
          *,
          user:users(id, username, email, first_name, last_name, role)
        `)
                .single();
            if (error) {
                throw new Error(`Erreur lors de la mise à jour: ${error.message}`);
            }
            return this.mapToTeacherResponse(updatedTeacher);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new Error(`Erreur lors de la mise à jour de l'enseignant: ${error.message}`);
        }
    }
    async deleteTeacher(id) {
        try {
            await this.getTeacherById(id);
            const { error } = await supabase_config_1.supabase
                .from(this.tableName)
                .delete()
                .eq('id', id);
            if (error) {
                throw new Error(`Erreur lors de la suppression: ${error.message}`);
            }
            return { message: 'Enseignant supprimé avec succès' };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Erreur lors de la suppression de l'enseignant: ${error.message}`);
        }
    }
    mapToTeacherResponse(teacher) {
        return {
            id: teacher.id,
            user_id: teacher.user_id,
            matricule: teacher.matricule,
            hire_date: teacher.hire_date,
            photo: teacher.photo,
            marital_status: teacher.marital_status,
            specialty: teacher.specialty,
            diplomas: teacher.diplomas,
            address: teacher.address,
            emergency_contact: teacher.emergency_contact,
            notes: teacher.notes,
            user: teacher.user
                ? {
                    id: teacher.user.id,
                    username: teacher.user.username,
                    email: teacher.user.email,
                    first_name: teacher.user.first_name,
                    last_name: teacher.user.last_name,
                    role: teacher.user.role,
                }
                : undefined,
        };
    }
};
exports.TeacherService = TeacherService;
exports.TeacherService = TeacherService = __decorate([
    (0, common_1.Injectable)()
], TeacherService);
//# sourceMappingURL=teacher.service.js.map