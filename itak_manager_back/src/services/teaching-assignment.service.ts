import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { supabase } from '../config/supabase.config';
import {
  TeachingAssignment,
  TeachingAssignmentResponse,
  CreateTeachingAssignmentDto,
  UpdateTeachingAssignmentDto,
} from '../models/teaching-assignment.model';

@Injectable()
export class TeachingAssignmentService {
  private readonly tableName = 'teaching_assignments';

  async createTeachingAssignment(
    createTeachingAssignmentDto: CreateTeachingAssignmentDto,
  ): Promise<TeachingAssignmentResponse> {
    try {
      // Vérifier si le professeur existe
      const { data: teacherData, error: teacherError } = await supabase
        .from('teachers')
        .select('id')
        .eq('id', createTeachingAssignmentDto.teacher_id)
        .single();

      if (teacherError || !teacherData) {
        throw new NotFoundException('Professeur non trouvé');
      }

      // Vérifier si la classe-matière existe
      const { data: classSubjectData, error: classSubjectError } =
        await supabase
          .from('class_subjects')
          .select('id')
          .eq('id', createTeachingAssignmentDto.class_subject_id)
          .single();

      if (classSubjectError || !classSubjectData) {
        throw new NotFoundException('Association classe-matière non trouvée');
      }

      // Vérifier si le professeur est déjà assigné à cette classe-matière
      const { data: existingAssignment } = await supabase
        .from(this.tableName)
        .select('id')
        .eq('teacher_id', createTeachingAssignmentDto.teacher_id)
        .eq('class_subject_id', createTeachingAssignmentDto.class_subject_id)
        .single();

      if (existingAssignment) {
        throw new ConflictException(
          'Ce professeur est déjà assigné à cette classe-matière',
        );
      }

      // Créer l'assignation
      const { data: newAssignment, error } = await supabase
        .from(this.tableName)
        .insert(createTeachingAssignmentDto)
        .select()
        .single();

      if (error) {
        throw new Error(
          `Erreur lors de la création de l'assignation: ${error.message}`,
        );
      }

      return this.mapToTeachingAssignmentResponse(newAssignment);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la création de l'assignation: ${error.message}`,
      );
    }
  }

  async getAllTeachingAssignments(): Promise<TeachingAssignmentResponse[]> {
    try {
      const { data: assignments, error } = await supabase
        .from(this.tableName)
        .select(
          `
          *,
          teacher:teachers(id, first_name, last_name),
          class_subject:class_subjects(
            id,
            class:classes(id, name, level),
            subject:subjects(id, name, code),
            coefficient,
            weekly_hours
          )
        `,
        )
        .order('teacher_id', { ascending: true });

      if (error) {
        throw new Error(
          `Erreur lors de la récupération des assignations: ${error.message}`,
        );
      }

      return assignments.map((assignment) =>
        this.mapToTeachingAssignmentResponse(assignment),
      );
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des assignations: ${error.message}`,
      );
    }
  }

  async getTeachingAssignmentById(
    id: number,
  ): Promise<TeachingAssignmentResponse> {
    try {
      const { data: assignment, error } = await supabase
        .from(this.tableName)
        .select(
          `
          *,
          teacher:teachers(id, first_name, last_name),
          class_subject:class_subjects(
            id,
            class:classes(id, name, level),
            subject:subjects(id, name, code),
            coefficient,
            weekly_hours
          )
        `,
        )
        .eq('id', id)
        .single();

      if (error || !assignment) {
        throw new NotFoundException('Assignation non trouvée');
      }

      return this.mapToTeachingAssignmentResponse(assignment);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la récupération de l'assignation: ${error.message}`,
      );
    }
  }

  async getTeachingAssignmentsByTeacher(
    teacherId: number,
  ): Promise<TeachingAssignmentResponse[]> {
    try {
      const { data: assignments, error } = await supabase
        .from(this.tableName)
        .select(
          `
          *,
          teacher:teachers(id, first_name, last_name),
          class_subject:class_subjects(
            id,
            class:classes(id, name, level),
            subject:subjects(id, name, code),
            coefficient,
            weekly_hours
          )
        `,
        )
        .eq('teacher_id', teacherId)
        .order('start_date', { ascending: false });

      if (error) {
        throw new Error(
          `Erreur lors de la récupération des assignations du professeur: ${error.message}`,
        );
      }

      return assignments.map((assignment) =>
        this.mapToTeachingAssignmentResponse(assignment),
      );
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des assignations du professeur: ${error.message}`,
      );
    }
  }

  async getTeachingAssignmentsByClassSubject(
    classSubjectId: number,
  ): Promise<TeachingAssignmentResponse[]> {
    try {
      const { data: assignments, error } = await supabase
        .from(this.tableName)
        .select(
          `
          *,
          teacher:teachers(id, first_name, last_name),
          class_subject:class_subjects(
            id,
            class:classes(id, name, level),
            subject:subjects(id, name, code),
            coefficient,
            weekly_hours
          )
        `,
        )
        .eq('class_subject_id', classSubjectId)
        .order('start_date', { ascending: false });

      if (error) {
        throw new Error(
          `Erreur lors de la récupération des assignations pour cette classe-matière: ${error.message}`,
        );
      }

      return assignments.map((assignment) =>
        this.mapToTeachingAssignmentResponse(assignment),
      );
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des assignations pour cette classe-matière: ${error.message}`,
      );
    }
  }

  async updateTeachingAssignment(
    id: number,
    updateTeachingAssignmentDto: UpdateTeachingAssignmentDto,
  ): Promise<TeachingAssignmentResponse> {
    try {
      // Vérifier que l'assignation existe
      await this.getTeachingAssignmentById(id);

      // Si le professeur est modifié, vérifier qu'il existe
      if (updateTeachingAssignmentDto.teacher_id) {
        const { data: teacherData, error: teacherError } = await supabase
          .from('teachers')
          .select('id')
          .eq('id', updateTeachingAssignmentDto.teacher_id)
          .single();

        if (teacherError || !teacherData) {
          throw new NotFoundException('Professeur non trouvé');
        }
      }

      // Si la classe-matière est modifiée, vérifier qu'elle existe
      if (updateTeachingAssignmentDto.class_subject_id) {
        const { data: classSubjectData, error: classSubjectError } =
          await supabase
            .from('class_subjects')
            .select('id')
            .eq('id', updateTeachingAssignmentDto.class_subject_id)
            .single();

        if (classSubjectError || !classSubjectData) {
          throw new NotFoundException('Association classe-matière non trouvée');
        }
      }

      // Si le professeur ou la classe-matière est modifiée, vérifier qu'il n'y a pas de conflit
      if (
        updateTeachingAssignmentDto.teacher_id ||
        updateTeachingAssignmentDto.class_subject_id
      ) {
        const currentAssignment = await this.getTeachingAssignmentById(id);
        const newTeacherId =
          updateTeachingAssignmentDto.teacher_id ||
          currentAssignment.teacher_id;
        const newClassSubjectId =
          updateTeachingAssignmentDto.class_subject_id ||
          currentAssignment.class_subject_id;

        const { data: existingAssignment } = await supabase
          .from(this.tableName)
          .select('id')
          .eq('teacher_id', newTeacherId)
          .eq('class_subject_id', newClassSubjectId)
          .neq('id', id)
          .single();

        if (existingAssignment) {
          throw new ConflictException(
            'Ce professeur est déjà assigné à cette classe-matière',
          );
        }
      }

      const { data: updatedAssignment, error } = await supabase
        .from(this.tableName)
        .update(updateTeachingAssignmentDto)
        .eq('id', id)
        .select(
          `
          *,
          teacher:teachers(id, first_name, last_name),
          class_subject:class_subjects(
            id,
            class:classes(id, name, level),
            subject:subjects(id, name, code),
            coefficient,
            weekly_hours
          )
        `,
        )
        .single();

      if (error) {
        throw new Error(`Erreur lors de la mise à jour: ${error.message}`);
      }

      return this.mapToTeachingAssignmentResponse(updatedAssignment);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la mise à jour de l'assignation: ${error.message}`,
      );
    }
  }

  async deleteTeachingAssignment(id: number): Promise<{ message: string }> {
    try {
      // Vérifier que l'assignation existe
      await this.getTeachingAssignmentById(id);

      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Erreur lors de la suppression: ${error.message}`);
      }

      return { message: 'Assignation supprimée avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la suppression de l'assignation: ${error.message}`,
      );
    }
  }

  private mapToTeachingAssignmentResponse(
    assignment: any,
  ): TeachingAssignmentResponse {
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
}
