import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { supabase } from '../config/supabase.config';
import {
  ClassCategory,
  ClassCategoryResponse,
  CreateClassCategoryDto,
  UpdateClassCategoryDto,
} from '../models/class-category.model';

@Injectable()
export class ClassCategoryService {
  private readonly tableName = 'class_category';

  async createClassCategory(
    createClassCategoryDto: CreateClassCategoryDto,
  ): Promise<ClassCategoryResponse> {
    try {
      // Vérifier si le nom existe déjà
      const { data: existingCategory } = await supabase
        .from(this.tableName)
        .select('id')
        .eq('name', createClassCategoryDto.name)
        .single();

      if (existingCategory) {
        throw new ConflictException('Une catégorie avec ce nom existe déjà');
      }

      // Créer la catégorie
      const { data: newCategory, error } = await supabase
        .from(this.tableName)
        .insert(createClassCategoryDto)
        .select()
        .single();

      if (error) {
        throw new Error(
          `Erreur lors de la création de la catégorie: ${error.message}`,
        );
      }

      return this.mapToClassCategoryResponse(newCategory);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la création de la catégorie: ${error.message}`,
      );
    }
  }

  async getAllClassCategories(): Promise<ClassCategoryResponse[]> {
    try {
      const { data: categories, error } = await supabase
        .from(this.tableName)
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        throw new Error(
          `Erreur lors de la récupération des catégories: ${error.message}`,
        );
      }

      return categories.map((category) =>
        this.mapToClassCategoryResponse(category),
      );
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des catégories: ${error.message}`,
      );
    }
  }

  async getClassCategoryById(id: number): Promise<ClassCategoryResponse> {
    try {
      const { data: category, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error || !category) {
        throw new NotFoundException('Catégorie non trouvée');
      }

      return this.mapToClassCategoryResponse(category);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la récupération de la catégorie: ${error.message}`,
      );
    }
  }

  async updateClassCategory(
    id: number,
    updateClassCategoryDto: UpdateClassCategoryDto,
  ): Promise<ClassCategoryResponse> {
    try {
      // Vérifier que la catégorie existe
      await this.getClassCategoryById(id);

      // Si le nom est modifié, vérifier qu'il n'existe pas déjà
      if (updateClassCategoryDto.name) {
        const { data: existingCategory } = await supabase
          .from(this.tableName)
          .select('id')
          .eq('name', updateClassCategoryDto.name)
          .neq('id', id)
          .single();

        if (existingCategory) {
          throw new ConflictException('Une catégorie avec ce nom existe déjà');
        }
      }

      const { data: updatedCategory, error } = await supabase
        .from(this.tableName)
        .update(updateClassCategoryDto)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Erreur lors de la mise à jour: ${error.message}`);
      }

      return this.mapToClassCategoryResponse(updatedCategory);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la mise à jour de la catégorie: ${error.message}`,
      );
    }
  }

  async deleteClassCategory(id: number): Promise<{ message: string }> {
    try {
      // Vérifier que la catégorie existe
      await this.getClassCategoryById(id);

      // Vérifier s'il y a des classes qui utilisent cette catégorie
      const { data: classesUsingCategory } = await supabase
        .from('classes')
        .select('id')
        .eq('categorie_id', id)
        .limit(1);

      if (classesUsingCategory && classesUsingCategory.length > 0) {
        throw new ConflictException(
          'Impossible de supprimer cette catégorie car elle est utilisée par des classes',
        );
      }

      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Erreur lors de la suppression: ${error.message}`);
      }

      return { message: 'Catégorie supprimée avec succès' };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new Error(
        `Erreur lors de la suppression de la catégorie: ${error.message}`,
      );
    }
  }

  // Méthode pour initialiser les catégories par défaut
  async initializeDefaultCategories(): Promise<void> {
    try {
      const defaultCategories = [{ name: 'Collège' }, { name: 'Faculté' }];

      for (const category of defaultCategories) {
        const { data: existingCategory } = await supabase
          .from(this.tableName)
          .select('id')
          .eq('name', category.name)
          .single();

        if (!existingCategory) {
          await supabase.from(this.tableName).insert(category);
        }
      }
    } catch (error) {
      console.log(
        'Catégories par défaut déjà initialisées ou erreur:',
        error.message,
      );
    }
  }

  private mapToClassCategoryResponse(category: any): ClassCategoryResponse {
    return {
      id: category.id,
      name: category.name,
      created_at: category.created_at,
    };
  }
}
