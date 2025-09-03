import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { supabase } from '../config/supabase.config';
import {
  ClassSubject,
  ClassSubjectResponse,
  CreateClassSubjectDto,
  UpdateClassSubjectDto,
} from '../models/class-subject.model';

@Injectable()
export class ClassSubjectService {
  private readonly tableName = 'class_subjects';

  async createClassSubject(
    createClassSubjectDto: CreateClassSubjectDto,
  ): Promise<ClassSubjectResponse> {
    try {
      // Vérifier si la classe existe
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('id')
        .eq('id', createClassSubjectDto.class_id)
        .single();

      if (classError || !classData) {
        throw new NotFoundException('Classe non trouvée');
      }

      // Vérifier si la matière existe
      const { data: subjectData, error: subjectError } = await supabase
        .from('subjects')
        .select('id')
        .eq('id', createClassSubjectDto.subject_id)
        .single();

      if (subjectError || !subjectData) {
        throw new NotFoundException('Matière non trouvée');
      }

      // Vérifier si la combinaison classe-matière existe déjà
      const { data: existingClassSubject } = await supabase
        .from(this.tableName)
        .select('id')
        .eq('class_id', createClassSubjectDto.class_id)
        .eq('subject_id', createClassSubjectDto.subject_id)
        .single();

      if (existingClassSubject) {
        throw new ConflictException(
          'Cette matière est déjà associée à cette classe',
        );
      }

      // Créer l'association classe-matière
      const { data: newClassSubject, error } = await supabase
        .from(this.tableName)
        .insert(createClassSubjectDto)
        .select()
        .single();

      if (error) {
        throw new Error(
          `Erreur lors de la création de l'association classe-matière: ${error.message}`,
        );
      }

      return this.mapToClassSubjectResponse(newClassSubject);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la création de l'association classe-matière: ${error.message}`,
      );
    }
  }

  async getAllClassSubjects(): Promise<ClassSubjectResponse[]> {
    try {
      const { data: classSubjects, error } = await supabase
        .from(this.tableName)
        .select(
          `
          *,
          class:classes(id, name, level),
          subject:subjects(id, name, code)
        `,
        )
        .order('class_id', { ascending: true });

      if (error) {
        throw new Error(
          `Erreur lors de la récupération des associations classe-matière: ${error.message}`,
        );
      }

      return classSubjects.map((classSubject) =>
        this.mapToClassSubjectResponse(classSubject),
      );
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des associations classe-matière: ${error.message}`,
      );
    }
  }

  async getClassSubjectById(id: number): Promise<ClassSubjectResponse> {
    try {
      const { data: classSubject, error } = await supabase
        .from(this.tableName)
        .select(
          `
          *,
          class:classes(id, name, level),
          subject:subjects(id, name, code)
        `,
        )
        .eq('id', id)
        .single();

      if (error || !classSubject) {
        throw new NotFoundException('Association classe-matière non trouvée');
      }

      return this.mapToClassSubjectResponse(classSubject);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la récupération de l'association classe-matière: ${error.message}`,
      );
    }
  }

  async getClassSubjectsByClass(
    classId: number,
  ): Promise<ClassSubjectResponse[]> {
    try {
      const { data: classSubjects, error } = await supabase
        .from(this.tableName)
        .select(
          `
          *,
          class:classes(id, name, level),
          subject:subjects(id, name, code)
        `,
        )
        .eq('class_id', classId)
        .order('subject_id', { ascending: true });

      if (error) {
        throw new Error(
          `Erreur lors de la récupération des matières de la classe: ${error.message}`,
        );
      }

      return classSubjects.map((classSubject) =>
        this.mapToClassSubjectResponse(classSubject),
      );
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des matières de la classe: ${error.message}`,
      );
    }
  }

  async getClassSubjectsBySubject(
    subjectId: number,
  ): Promise<ClassSubjectResponse[]> {
    try {
      const { data: classSubjects, error } = await supabase
        .from(this.tableName)
        .select(
          `
          *,
          class:classes(id, name, level),
          subject:subjects(id, name, code)
        `,
        )
        .eq('subject_id', subjectId)
        .order('class_id', { ascending: true });

      if (error) {
        throw new Error(
          `Erreur lors de la récupération des classes pour cette matière: ${error.message}`,
        );
      }

      return classSubjects.map((classSubject) =>
        this.mapToClassSubjectResponse(classSubject),
      );
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des classes pour cette matière: ${error.message}`,
      );
    }
  }

  async updateClassSubject(
    id: number,
    updateClassSubjectDto: UpdateClassSubjectDto,
  ): Promise<ClassSubjectResponse> {
    try {
      // Vérifier que l'association existe
      await this.getClassSubjectById(id);

      // Si la classe est modifiée, vérifier qu'elle existe
      if (updateClassSubjectDto.class_id) {
        const { data: classData, error: classError } = await supabase
          .from('classes')
          .select('id')
          .eq('id', updateClassSubjectDto.class_id)
          .single();

        if (classError || !classData) {
          throw new NotFoundException('Classe non trouvée');
        }
      }

      // Si la matière est modifiée, vérifier qu'elle existe
      if (updateClassSubjectDto.subject_id) {
        const { data: subjectData, error: subjectError } = await supabase
          .from('subjects')
          .select('id')
          .eq('id', updateClassSubjectDto.subject_id)
          .single();

        if (subjectError || !subjectData) {
          throw new NotFoundException('Matière non trouvée');
        }
      }

      // Si la classe ou la matière est modifiée, vérifier qu'il n'y a pas de conflit
      if (updateClassSubjectDto.class_id || updateClassSubjectDto.subject_id) {
        const currentClassSubject = await this.getClassSubjectById(id);
        const newClassId =
          updateClassSubjectDto.class_id || currentClassSubject.class_id;
        const newSubjectId =
          updateClassSubjectDto.subject_id || currentClassSubject.subject_id;

        const { data: existingClassSubject } = await supabase
          .from(this.tableName)
          .select('id')
          .eq('class_id', newClassId)
          .eq('subject_id', newSubjectId)
          .neq('id', id)
          .single();

        if (existingClassSubject) {
          throw new ConflictException(
            'Cette matière est déjà associée à cette classe',
          );
        }
      }

      const { data: updatedClassSubject, error } = await supabase
        .from(this.tableName)
        .update(updateClassSubjectDto)
        .eq('id', id)
        .select(
          `
          *,
          class:classes(id, name, level),
          subject:subjects(id, name, code)
        `,
        )
        .single();

      if (error) {
        throw new Error(`Erreur lors de la mise à jour: ${error.message}`);
      }

      return this.mapToClassSubjectResponse(updatedClassSubject);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la mise à jour de l'association classe-matière: ${error.message}`,
      );
    }
  }

  async deleteClassSubject(id: number): Promise<{ message: string }> {
    try {
      // Vérifier que l'association existe
      await this.getClassSubjectById(id);

      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Erreur lors de la suppression: ${error.message}`);
      }

      return { message: 'Association classe-matière supprimée avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la suppression de l'association classe-matière: ${error.message}`,
      );
    }
  }

  private mapToClassSubjectResponse(classSubject: any): ClassSubjectResponse {
    return {
      id: classSubject.id,
      class_id: classSubject.class_id,
      subject_id: classSubject.subject_id,
      coefficient: classSubject.coefficient,
      weekly_hours: classSubject.weekly_hours,
      is_optional: classSubject.is_optional,
      created_at: classSubject.created_at,
      class: classSubject.class
        ? {
            id: classSubject.class.id,
            name: classSubject.class.name,
            level: classSubject.class.level,
          }
        : undefined,
      subject: classSubject.subject
        ? {
            id: classSubject.subject.id,
            name: classSubject.subject.name,
            code: classSubject.subject.code,
          }
        : undefined,
    };
  }
}
