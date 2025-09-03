import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { supabase } from '../config/supabase.config';
import {
  StudentClass,
  StudentClassResponse,
  CreateStudentClassDto,
  UpdateStudentClassDto,
} from '../models/student-class.model';

@Injectable()
export class StudentClassService {
  private readonly tableName = 'student_classes';

  async createStudentClass(
    createStudentClassDto: CreateStudentClassDto,
  ): Promise<StudentClassResponse> {
    try {
      // Vérifier si l'étudiant existe
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('id')
        .eq('id', createStudentClassDto.student_id)
        .single();

      if (studentError || !studentData) {
        throw new NotFoundException('Étudiant non trouvé');
      }

      // Vérifier si la classe existe
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('id')
        .eq('id', createStudentClassDto.class_id)
        .single();

      if (classError || !classData) {
        throw new NotFoundException('Classe non trouvée');
      }

      // Vérifier si l'étudiant est déjà inscrit dans cette classe
      const { data: existingStudentClass } = await supabase
        .from(this.tableName)
        .select('id')
        .eq('student_id', createStudentClassDto.student_id)
        .eq('class_id', createStudentClassDto.class_id)
        .single();

      if (existingStudentClass) {
        throw new ConflictException(
          'Cet étudiant est déjà inscrit dans cette classe',
        );
      }

      // Créer l'inscription
      const { data: newStudentClass, error } = await supabase
        .from(this.tableName)
        .insert(createStudentClassDto)
        .select()
        .single();

      if (error) {
        throw new Error(
          `Erreur lors de l'inscription de l'étudiant: ${error.message}`,
        );
      }

      return this.mapToStudentClassResponse(newStudentClass);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new Error(
        `Erreur lors de l'inscription de l'étudiant: ${error.message}`,
      );
    }
  }

  async getAllStudentClasses(): Promise<StudentClassResponse[]> {
    try {
      const { data: studentClasses, error } = await supabase
        .from(this.tableName)
        .select(
          `
          *,
          student:students!inner(
            id,
            user:users!inner(first_name, last_name)
          ),
          class:classes(id, name, level)
        `,
        )
        .order('student_id', { ascending: true });

      if (error) {
        throw new Error(
          `Erreur lors de la récupération des inscriptions: ${error.message}`,
        );
      }

      return studentClasses.map((studentClass) =>
        this.mapToStudentClassResponse(studentClass),
      );
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des inscriptions: ${error.message}`,
      );
    }
  }

  async getStudentClassById(id: number): Promise<StudentClassResponse> {
    try {
      const { data: studentClass, error } = await supabase
        .from(this.tableName)
        .select(
          `
          *,
          student:students!inner(
            id,
            user:users!inner(first_name, last_name)
          ),
          class:classes(id, name, level)
        `,
        )
        .eq('id', id)
        .single();

      if (error || !studentClass) {
        throw new NotFoundException('Inscription non trouvée');
      }

      return this.mapToStudentClassResponse(studentClass);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la récupération de l'inscription: ${error.message}`,
      );
    }
  }

  async getStudentClassesByStudent(
    studentId: number,
  ): Promise<StudentClassResponse[]> {
    try {
      const { data: studentClasses, error } = await supabase
        .from(this.tableName)
        .select(
          `
          *,
          student:students!inner(
            id,
            user:users!inner(first_name, last_name)
          ),
          class:classes(id, name, level)
        `,
        )
        .eq('student_id', studentId)
        .order('start_date', { ascending: false });

      if (error) {
        throw new Error(
          `Erreur lors de la récupération des inscriptions de l'étudiant: ${error.message}`,
        );
      }

      return studentClasses.map((studentClass) =>
        this.mapToStudentClassResponse(studentClass),
      );
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des inscriptions de l'étudiant: ${error.message}`,
      );
    }
  }

  async getStudentClassesByClass(
    classId: number,
  ): Promise<StudentClassResponse[]> {
    try {
      const { data: studentClasses, error } = await supabase
        .from(this.tableName)
        .select(
          `
          *,
          student:students!inner(
            id,
            user:users!inner(first_name, last_name)
          ),
          class:classes(id, name, level)
        `,
        )
        .eq('class_id', classId)
        .order('start_date', { ascending: false });

      if (error) {
        throw new Error(
          `Erreur lors de la récupération des étudiants de la classe: ${error.message}`,
        );
      }

      return studentClasses.map((studentClass) =>
        this.mapToStudentClassResponse(studentClass),
      );
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des étudiants de la classe: ${error.message}`,
      );
    }
  }

  async updateStudentClass(
    id: number,
    updateStudentClassDto: UpdateStudentClassDto,
  ): Promise<StudentClassResponse> {
    try {
      // Vérifier que l'inscription existe
      await this.getStudentClassById(id);

      // Si l'étudiant est modifié, vérifier qu'il existe
      if (updateStudentClassDto.student_id) {
        const { data: studentData, error: studentError } = await supabase
          .from('students')
          .select('id')
          .eq('id', updateStudentClassDto.student_id)
          .single();

        if (studentError || !studentData) {
          throw new NotFoundException('Étudiant non trouvé');
        }
      }

      // Si la classe est modifiée, vérifier qu'elle existe
      if (updateStudentClassDto.class_id) {
        const { data: classData, error: classError } = await supabase
          .from('classes')
          .select('id')
          .eq('id', updateStudentClassDto.class_id)
          .single();

        if (classError || !classData) {
          throw new NotFoundException('Classe non trouvée');
        }
      }

      // Si l'étudiant ou la classe est modifiée, vérifier qu'il n'y a pas de conflit
      if (updateStudentClassDto.student_id || updateStudentClassDto.class_id) {
        const currentStudentClass = await this.getStudentClassById(id);
        const newStudentId =
          updateStudentClassDto.student_id || currentStudentClass.student_id;
        const newClassId =
          updateStudentClassDto.class_id || currentStudentClass.class_id;

        const { data: existingStudentClass } = await supabase
          .from(this.tableName)
          .select('id')
          .eq('student_id', newStudentId)
          .eq('class_id', newClassId)
          .neq('id', id)
          .single();

        if (existingStudentClass) {
          throw new ConflictException(
            'Cet étudiant est déjà inscrit dans cette classe',
          );
        }
      }

      const { data: updatedStudentClass, error } = await supabase
        .from(this.tableName)
        .update(updateStudentClassDto)
        .eq('id', id)
        .select(
          `
          *,
          student:students!inner(
            id,
            user:users!inner(first_name, last_name)
          ),
          class:classes(id, level)
        `,
        )
        .single();

      if (error) {
        throw new Error(`Erreur lors de la mise à jour: ${error.message}`);
      }

      return this.mapToStudentClassResponse(updatedStudentClass);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la mise à jour de l'inscription: ${error.message}`,
      );
    }
  }

  async deleteStudentClass(id: number): Promise<{ message: string }> {
    try {
      // Vérifier que l'inscription existe
      await this.getStudentClassById(id);

      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Erreur lors de la suppression: ${error.message}`);
      }

      return { message: 'Inscription supprimée avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la suppression de l'inscription: ${error.message}`,
      );
    }
  }

  private mapToStudentClassResponse(studentClass: any): StudentClassResponse {
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
}
