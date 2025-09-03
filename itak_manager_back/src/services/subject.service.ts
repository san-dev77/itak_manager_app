import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { supabase } from '../config/supabase.config';
import {
  Subject,
  SubjectResponse,
  CreateSubjectDto,
  UpdateSubjectDto,
} from '../models/subject.model';

@Injectable()
export class SubjectService {
  private readonly tableName = 'subjects';

  async createSubject(
    createSubjectDto: CreateSubjectDto,
  ): Promise<SubjectResponse> {
    try {
      // Vérifier si la catégorie existe
      const { data: category, error: categoryError } = await supabase
        .from('class_category')
        .select('id')
        .eq('id', createSubjectDto.categorie_id)
        .single();

      if (categoryError || !category) {
        throw new NotFoundException('Catégorie non trouvée');
      }

      // Vérifier si le code existe déjà
      const { data: existingSubject } = await supabase
        .from(this.tableName)
        .select('id')
        .eq('code', createSubjectDto.code)
        .single();

      if (existingSubject) {
        throw new ConflictException('Une matière avec ce code existe déjà');
      }

      // Vérifier si le nom existe déjà
      const { data: existingSubjectName } = await supabase
        .from(this.tableName)
        .select('id')
        .eq('name', createSubjectDto.name)
        .single();

      if (existingSubjectName) {
        throw new ConflictException('Une matière avec ce nom existe déjà');
      }

      // Créer la matière
      const { data: newSubject, error } = await supabase
        .from(this.tableName)
        .insert(createSubjectDto)
        .select()
        .single();

      if (error) {
        throw new Error(
          `Erreur lors de la création de la matière: ${error.message}`,
        );
      }

      return this.mapToSubjectResponse(newSubject);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la création de la matière: ${error.message}`,
      );
    }
  }

  async getAllSubjects(): Promise<SubjectResponse[]> {
    try {
      const { data: subjects, error } = await supabase
        .from(this.tableName)
        .select(
          `
          *,
          category:class_category(id, name)
        `,
        )
        .order('name', { ascending: true });

      if (error) {
        throw new Error(
          `Erreur lors de la récupération des matières: ${error.message}`,
        );
      }

      return subjects.map((subject) => this.mapToSubjectResponse(subject));
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des matières: ${error.message}`,
      );
    }
  }

  async getSubjectById(id: number): Promise<SubjectResponse> {
    try {
      const { data: subject, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error || !subject) {
        throw new NotFoundException('Matière non trouvée');
      }

      return this.mapToSubjectResponse(subject);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la récupération de la matière: ${error.message}`,
      );
    }
  }

  async getSubjectByCode(code: string): Promise<SubjectResponse> {
    try {
      const { data: subject, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('code', code)
        .single();

      if (error || !subject) {
        throw new NotFoundException('Matière non trouvée');
      }

      return this.mapToSubjectResponse(subject);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la récupération de la matière: ${error.message}`,
      );
    }
  }

  async getSubjectsByName(name: string): Promise<SubjectResponse[]> {
    try {
      const { data: subjects, error } = await supabase
        .from(this.tableName)
        .select('*')
        .ilike('name', `%${name}%`)
        .order('name', { ascending: true });

      if (error) {
        throw new Error(
          `Erreur lors de la récupération des matières: ${error.message}`,
        );
      }

      return subjects.map((subject) => this.mapToSubjectResponse(subject));
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des matières: ${error.message}`,
      );
    }
  }

  async getSubjectsByCategory(categoryId: number): Promise<SubjectResponse[]> {
    try {
      const { data: subjects, error } = await supabase
        .from(this.tableName)
        .select(
          `
          *,
          category:class_category(id, name)
        `,
        )
        .eq('categorie_id', categoryId)
        .order('name', { ascending: true });

      if (error) {
        throw new Error(
          `Erreur lors de la récupération des matières: ${error.message}`,
        );
      }

      return subjects.map((subject) => this.mapToSubjectResponse(subject));
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des matières: ${error.message}`,
      );
    }
  }

  async updateSubject(
    id: number,
    updateSubjectDto: UpdateSubjectDto,
  ): Promise<SubjectResponse> {
    try {
      // Vérifier que la matière existe
      await this.getSubjectById(id);

      // Si le code est modifié, vérifier qu'il n'existe pas déjà
      if (updateSubjectDto.code) {
        const { data: existingSubject } = await supabase
          .from(this.tableName)
          .select('id')
          .eq('code', updateSubjectDto.code)
          .neq('id', id)
          .single();

        if (existingSubject) {
          throw new ConflictException('Une matière avec ce code existe déjà');
        }
      }

      // Si le nom est modifié, vérifier qu'il n'existe pas déjà
      if (updateSubjectDto.name) {
        const { data: existingSubjectName } = await supabase
          .from(this.tableName)
          .select('id')
          .eq('name', updateSubjectDto.name)
          .neq('id', id)
          .single();

        if (existingSubjectName) {
          throw new ConflictException('Une matière avec ce nom existe déjà');
        }
      }

      const { data: updatedSubject, error } = await supabase
        .from(this.tableName)
        .update(updateSubjectDto)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Erreur lors de la mise à jour: ${error.message}`);
      }

      return this.mapToSubjectResponse(updatedSubject);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la mise à jour de la matière: ${error.message}`,
      );
    }
  }

  async deleteSubject(id: number): Promise<{ message: string }> {
    try {
      // Vérifier que la matière existe
      await this.getSubjectById(id);

      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Erreur lors de la suppression: ${error.message}`);
      }

      return { message: 'Matière supprimée avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la suppression de la matière: ${error.message}`,
      );
    }
  }

  private mapToSubjectResponse(subject: any): SubjectResponse {
    return {
      id: subject.id,
      name: subject.name,
      code: subject.code,
      categorie_id: subject.categorie_id,
      created_at: subject.created_at,
      category: subject.category
        ? {
            id: subject.category.id,
            name: subject.category.name,
          }
        : undefined,
    };
  }
}
