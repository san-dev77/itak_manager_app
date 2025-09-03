import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { supabase } from '../config/supabase.config';
import {
  Staff,
  StaffResponse,
  CreateStaffDto,
  UpdateStaffDto,
} from '../models/staff.model';

@Injectable()
export class StaffService {
  private readonly tableName = 'staff';

  async createStaff(createStaffDto: CreateStaffDto): Promise<StaffResponse> {
    try {
      // Vérifier si l'utilisateur existe
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id, role')
        .eq('id', createStaffDto.user_id)
        .single();

      if (userError || !user) {
        throw new NotFoundException('Utilisateur non trouvé');
      }

      if (user.role !== 'staff') {
        throw new ConflictException(
          'Seuls les utilisateurs avec le rôle "staff" peuvent être du personnel administratif',
        );
      }

      // Vérifier si le matricule existe déjà
      const { data: existingMatricule } = await supabase
        .from(this.tableName)
        .select('id')
        .eq('matricule', createStaffDto.matricule)
        .single();

      if (existingMatricule) {
        throw new ConflictException(
          'Un membre du personnel avec ce matricule existe déjà',
        );
      }

      // Vérifier si l'utilisateur est déjà du personnel administratif
      const { data: existingStaff } = await supabase
        .from(this.tableName)
        .select('id')
        .eq('user_id', createStaffDto.user_id)
        .single();

      if (existingStaff) {
        throw new ConflictException(
          'Cet utilisateur est déjà du personnel administratif',
        );
      }

      // Créer le membre du personnel
      const { data: newStaff, error } = await supabase
        .from(this.tableName)
        .insert(createStaffDto)
        .select()
        .single();

      if (error) {
        throw new Error(
          `Erreur lors de la création du personnel: ${error.message}`,
        );
      }

      return this.mapToStaffResponse(newStaff);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la création du personnel: ${error.message}`,
      );
    }
  }

  async getAllStaff(): Promise<StaffResponse[]> {
    try {
      const { data: staff, error } = await supabase
        .from(this.tableName)
        .select(
          `
          *,
          user:users(id, username, email, first_name, last_name, role)
        `,
        )
        .order('id', { ascending: false });

      if (error) {
        throw new Error(
          `Erreur lors de la récupération du personnel: ${error.message}`,
        );
      }

      return staff.map((staffMember) => this.mapToStaffResponse(staffMember));
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération du personnel: ${error.message}`,
      );
    }
  }

  async getStaffById(id: number): Promise<StaffResponse> {
    try {
      const { data: staff, error } = await supabase
        .from(this.tableName)
        .select(
          `
          *,
          user:users(id, username, email, first_name, last_name, role)
        `,
        )
        .eq('id', id)
        .single();

      if (error || !staff) {
        throw new NotFoundException('Membre du personnel non trouvé');
      }

      return this.mapToStaffResponse(staff);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la récupération du personnel: ${error.message}`,
      );
    }
  }

  async getStaffByUserId(userId: number): Promise<StaffResponse> {
    try {
      const { data: staff, error } = await supabase
        .from(this.tableName)
        .select(
          `
          *,
          user:users(id, username, email, first_name, last_name, role)
        `,
        )
        .eq('user_id', userId)
        .single();

      if (error || !staff) {
        throw new NotFoundException('Membre du personnel non trouvé');
      }

      return this.mapToStaffResponse(staff);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la récupération du personnel: ${error.message}`,
      );
    }
  }

  async getStaffByMatricule(matricule: string): Promise<StaffResponse> {
    try {
      const { data: staff, error } = await supabase
        .from(this.tableName)
        .select(
          `
          *,
          user:users(id, username, email, first_name, last_name, role)
        `,
        )
        .eq('matricule', matricule)
        .single();

      if (error || !staff) {
        throw new NotFoundException('Membre du personnel non trouvé');
      }

      return this.mapToStaffResponse(staff);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la récupération du personnel: ${error.message}`,
      );
    }
  }

  async getStaffByPosition(position: string): Promise<StaffResponse[]> {
    try {
      const { data: staff, error } = await supabase
        .from(this.tableName)
        .select(
          `
          *,
          user:users(id, username, email, first_name, last_name, role)
        `,
        )
        .ilike('position', `%${position}%`)
        .order('id', { ascending: false });

      if (error) {
        throw new Error(
          `Erreur lors de la récupération du personnel: ${error.message}`,
        );
      }

      return staff.map((staffMember) => this.mapToStaffResponse(staffMember));
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération du personnel: ${error.message}`,
      );
    }
  }

  async updateStaff(
    id: number,
    updateStaffDto: UpdateStaffDto,
  ): Promise<StaffResponse> {
    try {
      // Vérifier que le membre du personnel existe
      await this.getStaffById(id);

      // Si le matricule est modifié, vérifier qu'il n'existe pas déjà
      if (updateStaffDto.matricule) {
        const { data: existingMatricule } = await supabase
          .from(this.tableName)
          .select('id')
          .eq('matricule', updateStaffDto.matricule)
          .neq('id', id)
          .single();

        if (existingMatricule) {
          throw new ConflictException(
            'Un membre du personnel avec ce matricule existe déjà',
          );
        }
      }

      const { data: updatedStaff, error } = await supabase
        .from(this.tableName)
        .update(updateStaffDto)
        .eq('id', id)
        .select(
          `
          *,
          user:users(id, username, email, first_name, last_name, role)
        `,
        )
        .single();

      if (error) {
        throw new Error(`Erreur lors de la mise à jour: ${error.message}`);
      }

      return this.mapToStaffResponse(updatedStaff);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la mise à jour du personnel: ${error.message}`,
      );
    }
  }

  async deleteStaff(id: number): Promise<{ message: string }> {
    try {
      // Vérifier que le membre du personnel existe
      await this.getStaffById(id);

      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Erreur lors de la suppression: ${error.message}`);
      }

      return { message: 'Membre du personnel supprimé avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la suppression du personnel: ${error.message}`,
      );
    }
  }

  private mapToStaffResponse(staff: any): StaffResponse {
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
}
