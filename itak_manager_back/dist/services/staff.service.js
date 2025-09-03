"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffService = void 0;
const common_1 = require("@nestjs/common");
const supabase_config_1 = require("../config/supabase.config");
let StaffService = class StaffService {
    tableName = 'staff';
    async createStaff(createStaffDto) {
        try {
            const { data: user, error: userError } = await supabase_config_1.supabase
                .from('users')
                .select('id, role')
                .eq('id', createStaffDto.user_id)
                .single();
            if (userError || !user) {
                throw new common_1.NotFoundException('Utilisateur non trouvé');
            }
            if (user.role !== 'staff') {
                throw new common_1.ConflictException('Seuls les utilisateurs avec le rôle "staff" peuvent être du personnel administratif');
            }
            const { data: existingMatricule } = await supabase_config_1.supabase
                .from(this.tableName)
                .select('id')
                .eq('matricule', createStaffDto.matricule)
                .single();
            if (existingMatricule) {
                throw new common_1.ConflictException('Un membre du personnel avec ce matricule existe déjà');
            }
            const { data: existingStaff } = await supabase_config_1.supabase
                .from(this.tableName)
                .select('id')
                .eq('user_id', createStaffDto.user_id)
                .single();
            if (existingStaff) {
                throw new common_1.ConflictException('Cet utilisateur est déjà du personnel administratif');
            }
            const { data: newStaff, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .insert(createStaffDto)
                .select()
                .single();
            if (error) {
                throw new Error(`Erreur lors de la création du personnel: ${error.message}`);
            }
            return this.mapToStaffResponse(newStaff);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new Error(`Erreur lors de la création du personnel: ${error.message}`);
        }
    }
    async getAllStaff() {
        try {
            const { data: staff, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .select(`
          *,
          user:users(id, username, email, first_name, last_name, role)
        `)
                .order('id', { ascending: false });
            if (error) {
                throw new Error(`Erreur lors de la récupération du personnel: ${error.message}`);
            }
            return staff.map((staffMember) => this.mapToStaffResponse(staffMember));
        }
        catch (error) {
            throw new Error(`Erreur lors de la récupération du personnel: ${error.message}`);
        }
    }
    async getStaffById(id) {
        try {
            const { data: staff, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .select(`
          *,
          user:users(id, username, email, first_name, last_name, role)
        `)
                .eq('id', id)
                .single();
            if (error || !staff) {
                throw new common_1.NotFoundException('Membre du personnel non trouvé');
            }
            return this.mapToStaffResponse(staff);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Erreur lors de la récupération du personnel: ${error.message}`);
        }
    }
    async getStaffByUserId(userId) {
        try {
            const { data: staff, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .select(`
          *,
          user:users(id, username, email, first_name, last_name, role)
        `)
                .eq('user_id', userId)
                .single();
            if (error || !staff) {
                throw new common_1.NotFoundException('Membre du personnel non trouvé');
            }
            return this.mapToStaffResponse(staff);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Erreur lors de la récupération du personnel: ${error.message}`);
        }
    }
    async getStaffByMatricule(matricule) {
        try {
            const { data: staff, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .select(`
          *,
          user:users(id, username, email, first_name, last_name, role)
        `)
                .eq('matricule', matricule)
                .single();
            if (error || !staff) {
                throw new common_1.NotFoundException('Membre du personnel non trouvé');
            }
            return this.mapToStaffResponse(staff);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Erreur lors de la récupération du personnel: ${error.message}`);
        }
    }
    async getStaffByPosition(position) {
        try {
            const { data: staff, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .select(`
          *,
          user:users(id, username, email, first_name, last_name, role)
        `)
                .ilike('position', `%${position}%`)
                .order('id', { ascending: false });
            if (error) {
                throw new Error(`Erreur lors de la récupération du personnel: ${error.message}`);
            }
            return staff.map((staffMember) => this.mapToStaffResponse(staffMember));
        }
        catch (error) {
            throw new Error(`Erreur lors de la récupération du personnel: ${error.message}`);
        }
    }
    async updateStaff(id, updateStaffDto) {
        try {
            await this.getStaffById(id);
            if (updateStaffDto.matricule) {
                const { data: existingMatricule } = await supabase_config_1.supabase
                    .from(this.tableName)
                    .select('id')
                    .eq('matricule', updateStaffDto.matricule)
                    .neq('id', id)
                    .single();
                if (existingMatricule) {
                    throw new common_1.ConflictException('Un membre du personnel avec ce matricule existe déjà');
                }
            }
            const { data: updatedStaff, error } = await supabase_config_1.supabase
                .from(this.tableName)
                .update(updateStaffDto)
                .eq('id', id)
                .select(`
          *,
          user:users(id, username, email, first_name, last_name, role)
        `)
                .single();
            if (error) {
                throw new Error(`Erreur lors de la mise à jour: ${error.message}`);
            }
            return this.mapToStaffResponse(updatedStaff);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new Error(`Erreur lors de la mise à jour du personnel: ${error.message}`);
        }
    }
    async deleteStaff(id) {
        try {
            await this.getStaffById(id);
            const { error } = await supabase_config_1.supabase
                .from(this.tableName)
                .delete()
                .eq('id', id);
            if (error) {
                throw new Error(`Erreur lors de la suppression: ${error.message}`);
            }
            return { message: 'Membre du personnel supprimé avec succès' };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Erreur lors de la suppression du personnel: ${error.message}`);
        }
    }
    mapToStaffResponse(staff) {
        return {
            id: staff.id,
            user_id: staff.user_id,
            matricule: staff.matricule,
            hire_date: staff.hire_date,
            position: staff.position,
            photo: staff.photo,
            marital_status: staff.marital_status,
            address: staff.address,
            emergency_contact: staff.emergency_contact,
            notes: staff.notes,
            user: staff.user
                ? {
                    id: staff.user.id,
                    username: staff.user.username,
                    email: staff.user.email,
                    first_name: staff.user.first_name,
                    last_name: staff.user.last_name,
                    role: staff.user.role,
                }
                : undefined,
        };
    }
};
exports.StaffService = StaffService;
exports.StaffService = StaffService = __decorate([
    (0, common_1.Injectable)()
], StaffService);
//# sourceMappingURL=staff.service.js.map