import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { supabase } from '../config/supabase.config';
import {
  Class,
  ClassResponse,
  CreateClassDto,
  UpdateClassDto,
} from '../models/class.model';

@Injectable()
export class ClassService {
  private readonly tableName = 'classes';

  async createClass(createClassDto: CreateClassDto): Promise<ClassResponse> {
    try {
      // Vérifier si la catégorie existe
      const { data: category, error: categoryError } = await supabase
        .from('class_category')
        .select('id')
        .eq('id', createClassDto.categorie_id)
        .single();

      if (categoryError || !category) {
        throw new NotFoundException('Catégorie non trouvée');
      }

      // Vérifier si le nom de la classe existe déjà dans la même catégorie
      const { data: existingClass } = await supabase
        .from(this.tableName)
        .select('id')
        .eq('name', createClassDto.name)
        .eq('categorie_id', createClassDto.categorie_id)
        .single();

      if (existingClass) {
        throw new ConflictException(
          'Une classe avec ce nom existe déjà dans cette catégorie',
        );
      }

      // Créer la classe
      const { data: newClass, error } = await supabase
        .from(this.tableName)
        .insert(createClassDto)
        .select()
        .single();

      if (error) {
        throw new Error(
          `Erreur lors de la création de la classe: ${error.message}`,
        );
      }

      return this.mapToClassResponse(newClass);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la création de la classe: ${error.message}`,
      );
    }
  }

  async getAllClasses(): Promise<ClassResponse[]> {
    try {
      const { data: classes, error } = await supabase
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
          `Erreur lors de la récupération des classes: ${error.message}`,
        );
      }

      return classes.map((classItem) => this.mapToClassResponse(classItem));
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des classes: ${error.message}`,
      );
    }
  }

  async getClassById(id: number): Promise<ClassResponse> {
    try {
      const { data: classItem, error } = await supabase
        .from(this.tableName)
        .select(
          `
          *,
          category:class_category(id, name)
        `,
        )
        .eq('id', id)
        .single();

      if (error || !classItem) {
        throw new NotFoundException('Classe non trouvée');
      }

      return this.mapToClassResponse(classItem);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la récupération de la classe: ${error.message}`,
      );
    }
  }

  async getClassesByCategory(categoryId: number): Promise<ClassResponse[]> {
    try {
      const { data: classes, error } = await supabase
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
          `Erreur lors de la récupération des classes: ${error.message}`,
        );
      }

      return classes.map((classItem) => this.mapToClassResponse(classItem));
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des classes: ${error.message}`,
      );
    }
  }

  async getClassesByLevel(level: string): Promise<ClassResponse[]> {
    try {
      const { data: classes, error } = await supabase
        .from(this.tableName)
        .select(
          `
          *,
          category:class_category(id, name)
        `,
        )
        .ilike('level', `%${level}%`)
        .order('name', { ascending: true });

      if (error) {
        throw new Error(
          `Erreur lors de la récupération des classes: ${error.message}`,
        );
      }

      return classes.map((classItem) => this.mapToClassResponse(classItem));
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des classes: ${error.message}`,
      );
    }
  }

  async updateClass(
    id: number,
    updateClassDto: UpdateClassDto,
  ): Promise<ClassResponse> {
    try {
      // Vérifier que la classe existe
      await this.getClassById(id);

      // Si la catégorie est modifiée, vérifier qu'elle existe
      if (updateClassDto.categorie_id) {
        const { data: category, error: categoryError } = await supabase
          .from('class_category')
          .select('id')
          .eq('id', updateClassDto.categorie_id)
          .single();

        if (categoryError || !category) {
          throw new NotFoundException('Catégorie non trouvée');
        }
      }

      // Si le nom est modifié, vérifier qu'il n'existe pas déjà dans la même catégorie
      if (updateClassDto.name) {
        const currentClass = await this.getClassById(id);
        const categoryId =
          updateClassDto.categorie_id || currentClass.categorie_id;

        const { data: existingClass } = await supabase
          .from(this.tableName)
          .select('id')
          .eq('name', updateClassDto.name)
          .eq('categorie_id', categoryId)
          .neq('id', id)
          .single();

        if (existingClass) {
          throw new ConflictException(
            'Une classe avec ce nom existe déjà dans cette catégorie',
          );
        }
      }

      const { data: updatedClass, error } = await supabase
        .from(this.tableName)
        .update(updateClassDto)
        .eq('id', id)
        .select(
          `
          *,
          category:class_category(id, name)
        `,
        )
        .single();

      if (error) {
        throw new Error(`Erreur lors de la mise à jour: ${error.message}`);
      }

      return this.mapToClassResponse(updatedClass);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la mise à jour de la classe: ${error.message}`,
      );
    }
  }

  async deleteClass(id: number): Promise<{ message: string }> {
    try {
      // Vérifier que la classe existe
      await this.getClassById(id);

      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Erreur lors de la suppression: ${error.message}`);
      }

      return { message: 'Classe supprimée avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la suppression de la classe: ${error.message}`,
      );
    }
  }

  private mapToClassResponse(classItem: any): ClassResponse {
    return {
      id: classItem.id,
      name: classItem.name,
      level: classItem.level,
      capacity: classItem.capacity,
      categorie_id: classItem.categorie_id,
      created_at: classItem.created_at,
      category: classItem.category
        ? {
            id: classItem.category.id,
            name: classItem.category.name,
          }
        : undefined,
    };
  }
}
