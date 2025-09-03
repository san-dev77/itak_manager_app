import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { supabase } from '../config/supabase.config';
import {
  Teacher,
  TeacherResponse,
  CreateTeacherDto,
  UpdateTeacherDto,
} from '../models/teacher.model';

@Injectable()
export class TeacherService {
  private readonly tableName = 'teachers';

  async createTeacher(
    createTeacherDto: CreateTeacherDto,
  ): Promise<TeacherResponse> {
    try {
      // Vérifier si l'utilisateur existe
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id, role')
        .eq('id', createTeacherDto.user_id)
        .single();

      if (userError || !user) {
        throw new NotFoundException('Utilisateur non trouvé');
      }

      if (user.role !== 'teacher') {
        throw new ConflictException(
          'Seuls les utilisateurs avec le rôle "teacher" peuvent être des enseignants',
        );
      }

      // Vérifier si le matricule existe déjà
      const { data: existingMatricule } = await supabase
        .from(this.tableName)
        .select('id')
        .eq('matricule', createTeacherDto.matricule)
        .single();

      if (existingMatricule) {
        throw new ConflictException(
          'Un enseignant avec ce matricule existe déjà',
        );
      }

      // Vérifier si l'utilisateur est déjà un enseignant
      const { data: existingTeacher } = await supabase
        .from(this.tableName)
        .select('id')
        .eq('user_id', createTeacherDto.user_id)
        .single();

      if (existingTeacher) {
        throw new ConflictException('Cet utilisateur est déjà un enseignant');
      }

      // Créer l'enseignant
      const { data: newTeacher, error } = await supabase
        .from(this.tableName)
        .insert(createTeacherDto)
        .select()
        .single();

      if (error) {
        throw new Error(
          `Erreur lors de la création de l'enseignant: ${error.message}`,
        );
      }

      return this.mapToTeacherResponse(newTeacher);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la création de l'enseignant: ${error.message}`,
      );
    }
  }

  async getAllTeachers(): Promise<TeacherResponse[]> {
    try {
      const { data: teachers, error } = await supabase
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
          `Erreur lors de la récupération des enseignants: ${error.message}`,
        );
      }

      return teachers.map((teacher) => this.mapToTeacherResponse(teacher));
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des enseignants: ${error.message}`,
      );
    }
  }

  async getTeacherById(id: number): Promise<TeacherResponse> {
    try {
      const { data: teacher, error } = await supabase
        .from(this.tableName)
        .select(
          `
          *,
          user:users(id, username, email, first_name, last_name, role)
        `,
        )
        .eq('id', id)
        .single();

      if (error || !teacher) {
        throw new NotFoundException('Enseignant non trouvé');
      }

      return this.mapToTeacherResponse(teacher);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la récupération de l'enseignant: ${error.message}`,
      );
    }
  }

  async getTeacherByUserId(userId: number): Promise<TeacherResponse> {
    try {
      const { data: teacher, error } = await supabase
        .from(this.tableName)
        .select(
          `
          *,
          user:users(id, username, email, first_name, last_name, role)
        `,
        )
        .eq('user_id', userId)
        .single();

      if (error || !teacher) {
        throw new NotFoundException('Enseignant non trouvé');
      }

      return this.mapToTeacherResponse(teacher);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la récupération de l'enseignant: ${error.message}`,
      );
    }
  }

  async getTeacherByMatricule(matricule: string): Promise<TeacherResponse> {
    try {
      const { data: teacher, error } = await supabase
        .from(this.tableName)
        .select(
          `
          *,
          user:users(id, username, email, first_name, last_name, role)
        `,
        )
        .eq('matricule', matricule)
        .single();

      if (error || !teacher) {
        throw new NotFoundException('Enseignant non trouvé');
      }

      return this.mapToTeacherResponse(teacher);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la récupération de l'enseignant: ${error.message}`,
      );
    }
  }

  async getTeachersBySpecialty(specialty: string): Promise<TeacherResponse[]> {
    try {
      const { data: teachers, error } = await supabase
        .from(this.tableName)
        .select(
          `
          *,
          user:users(id, username, email, first_name, last_name, role)
        `,
        )
        .ilike('specialty', `%${specialty}%`)
        .order('id', { ascending: false });

      if (error) {
        throw new Error(
          `Erreur lors de la récupération des enseignants: ${error.message}`,
        );
      }

      return teachers.map((teacher) => this.mapToTeacherResponse(teacher));
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des enseignants: ${error.message}`,
      );
    }
  }

  async updateTeacher(
    id: number,
    updateTeacherDto: UpdateTeacherDto,
  ): Promise<TeacherResponse> {
    try {
      // Vérifier que l'enseignant existe
      await this.getTeacherById(id);

      // Si le matricule est modifié, vérifier qu'il n'existe pas déjà
      if (updateTeacherDto.matricule) {
        const { data: existingMatricule } = await supabase
          .from(this.tableName)
          .select('id')
          .eq('matricule', updateTeacherDto.matricule)
          .neq('id', id)
          .single();

        if (existingMatricule) {
          throw new ConflictException(
            'Un enseignant avec ce matricule existe déjà',
          );
        }
      }

      const { data: updatedTeacher, error } = await supabase
        .from(this.tableName)
        .update(updateTeacherDto)
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

      return this.mapToTeacherResponse(updatedTeacher);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la mise à jour de l'enseignant: ${error.message}`,
      );
    }
  }

  async deleteTeacher(id: number): Promise<{ message: string }> {
    try {
      // Vérifier que l'enseignant existe
      await this.getTeacherById(id);

      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Erreur lors de la suppression: ${error.message}`);
      }

      return { message: 'Enseignant supprimé avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la suppression de l'enseignant: ${error.message}`,
      );
    }
  }

  private mapToTeacherResponse(teacher: any): TeacherResponse {
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
}
