import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { supabase } from '../config/supabase.config';
import {
  Student,
  StudentResponse,
  CreateStudentDto,
  UpdateStudentDto,
} from '../models/student.model';

@Injectable()
export class StudentService {
  private readonly tableName = 'students';

  async createStudent(
    createStudentDto: CreateStudentDto,
  ): Promise<StudentResponse> {
    try {
      // Vérifier si l'utilisateur existe
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id, role')
        .eq('id', createStudentDto.user_id)
        .single();

      if (userError || !user) {
        throw new NotFoundException('Utilisateur non trouvé');
      }

      if (user.role !== 'student') {
        throw new ConflictException(
          'Seuls les utilisateurs avec le rôle "student" peuvent être des étudiants',
        );
      }

      // Vérifier si le matricule existe déjà
      const { data: existingMatricule } = await supabase
        .from(this.tableName)
        .select('id')
        .eq('matricule', createStudentDto.matricule)
        .single();

      if (existingMatricule) {
        throw new ConflictException(
          'Un étudiant avec ce matricule existe déjà',
        );
      }

      // Vérifier si l'utilisateur est déjà un étudiant
      const { data: existingStudent } = await supabase
        .from(this.tableName)
        .select('id')
        .eq('user_id', createStudentDto.user_id)
        .single();

      if (existingStudent) {
        throw new ConflictException('Cet utilisateur est déjà un étudiant');
      }

      // Créer l'étudiant
      const { data: newStudent, error } = await supabase
        .from(this.tableName)
        .insert(createStudentDto)
        .select()
        .single();

      if (error) {
        throw new Error(
          `Erreur lors de la création de l'étudiant: ${error.message}`,
        );
      }

      return this.mapToStudentResponse(newStudent);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la création de l'étudiant: ${error.message}`,
      );
    }
  }

  async getAllStudents(): Promise<StudentResponse[]> {
    try {
      const { data: students, error } = await supabase
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
          `Erreur lors de la récupération des étudiants: ${error.message}`,
        );
      }

      return students.map((student) => this.mapToStudentResponse(student));
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des étudiants: ${error.message}`,
      );
    }
  }

  async getStudentById(id: number): Promise<StudentResponse> {
    try {
      const { data: student, error } = await supabase
        .from(this.tableName)
        .select(
          `
          *,
          user:users(id, username, email, first_name, last_name, role)
        `,
        )
        .eq('id', id)
        .single();

      if (error || !student) {
        throw new NotFoundException('Étudiant non trouvé');
      }

      return this.mapToStudentResponse(student);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la récupération de l'étudiant: ${error.message}`,
      );
    }
  }

  async getStudentByUserId(userId: number): Promise<StudentResponse> {
    try {
      const { data: student, error } = await supabase
        .from(this.tableName)
        .select(
          `
          *,
          user:users(id, username, email, first_name, last_name, role)
        `,
        )
        .eq('user_id', userId)
        .single();

      if (error || !student) {
        throw new NotFoundException('Étudiant non trouvé');
      }

      return this.mapToStudentResponse(student);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la récupération de l'étudiant: ${error.message}`,
      );
    }
  }

  async getStudentByMatricule(matricule: string): Promise<StudentResponse> {
    try {
      const { data: student, error } = await supabase
        .from(this.tableName)
        .select(
          `
          *,
          user:users(id, username, email, first_name, last_name, role)
        `,
        )
        .eq('matricule', matricule)
        .single();

      if (error || !student) {
        throw new NotFoundException('Étudiant non trouvé');
      }

      return this.mapToStudentResponse(student);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la récupération de l'étudiant: ${error.message}`,
      );
    }
  }

  async updateStudent(
    id: number,
    updateStudentDto: UpdateStudentDto,
  ): Promise<StudentResponse> {
    try {
      // Vérifier que l'étudiant existe
      await this.getStudentById(id);

      // Si le matricule est modifié, vérifier qu'il n'existe pas déjà
      if (updateStudentDto.matricule) {
        const { data: existingMatricule } = await supabase
          .from(this.tableName)
          .select('id')
          .eq('matricule', updateStudentDto.matricule)
          .neq('id', id)
          .single();

        if (existingMatricule) {
          throw new ConflictException(
            'Un étudiant avec ce matricule existe déjà',
          );
        }
      }

      const { data: updatedStudent, error } = await supabase
        .from(this.tableName)
        .update(updateStudentDto)
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

      return this.mapToStudentResponse(updatedStudent);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la mise à jour de l'étudiant: ${error.message}`,
      );
    }
  }

  async deleteStudent(id: number): Promise<{ message: string }> {
    try {
      // Vérifier que l'étudiant existe
      await this.getStudentById(id);

      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Erreur lors de la suppression: ${error.message}`);
      }

      return { message: 'Étudiant supprimé avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la suppression de l'étudiant: ${error.message}`,
      );
    }
  }

  private mapToStudentResponse(student: any): StudentResponse {
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
}
