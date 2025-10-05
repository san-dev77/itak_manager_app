import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassCategory } from '../../entities/class-category.entity';
import {
  ClassCategoryResponseDto,
  CreateClassCategoryDto,
  UpdateClassCategoryDto,
} from './dto/class-category.dto';

@Injectable()
export class ClassCategoryService {
  constructor(
    @InjectRepository(ClassCategory)
    private readonly classCategoryRepository: Repository<ClassCategory>,
  ) {}

  async createClassCategory(
    createClassCategoryDto: CreateClassCategoryDto,
  ): Promise<ClassCategoryResponseDto> {
    try {
      // Vérifier si le nom existe déjà
      const existingCategory = await this.classCategoryRepository.findOne({
        where: { name: createClassCategoryDto.name },
      });

      if (existingCategory) {
        throw new ConflictException('Une catégorie avec ce nom existe déjà');
      }

      const category = this.classCategoryRepository.create(
        createClassCategoryDto,
      );
      const savedCategory = await this.classCategoryRepository.save(category);

      return this.mapToClassCategory(savedCategory);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(`Erreur lors de la création de la catégorie: ${message}`);
    }
  }

  async getAllClassCategories(): Promise<ClassCategoryResponseDto[]> {
    try {
      const categories = await this.classCategoryRepository.find({
        order: { createdAt: 'DESC' },
      });

      return categories.map((category) => this.mapToClassCategory(category));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération des catégories: ${message}`,
      );
    }
  }

  async getClassCategoryById(id: string): Promise<ClassCategoryResponseDto> {
    try {
      const category = await this.classCategoryRepository.findOne({
        where: { id },
      });

      if (!category) {
        throw new NotFoundException('Catégorie non trouvée');
      }

      return this.mapToClassCategory(category);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération de la catégorie: ${message}`,
      );
    }
  }

  async getClassCategoryByName(
    name: string,
  ): Promise<ClassCategoryResponseDto> {
    try {
      const category = await this.classCategoryRepository.findOne({
        where: { name },
      });

      if (!category) {
        throw new NotFoundException('Catégorie non trouvée');
      }

      return this.mapToClassCategory(category);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération de la catégorie: ${message}`,
      );
    }
  }

  async updateClassCategory(
    id: string,
    updateClassCategoryDto: UpdateClassCategoryDto,
  ): Promise<ClassCategoryResponseDto> {
    try {
      // Vérifier que la catégorie existe
      await this.getClassCategoryById(id);

      // Si le nom est modifié, vérifier qu'il n'existe pas déjà
      if (updateClassCategoryDto.name) {
        const existingCategory = await this.classCategoryRepository.findOne({
          where: { name: updateClassCategoryDto.name },
        });

        if (existingCategory && existingCategory.id !== id) {
          throw new ConflictException('Une catégorie avec ce nom existe déjà');
        }
      }

      await this.classCategoryRepository.update(id, updateClassCategoryDto);

      const updatedCategory = await this.classCategoryRepository.findOne({
        where: { id },
      });

      if (!updatedCategory) {
        throw new NotFoundException('Catégorie non trouvée après mise à jour');
      }

      return this.mapToClassCategory(updatedCategory);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la mise à jour de la catégorie: ${message}`,
      );
    }
  }

  async deleteClassCategory(id: string): Promise<{ message: string }> {
    try {
      // Vérifier que la catégorie existe
      await this.getClassCategoryById(id);

      await this.classCategoryRepository.delete(id);

      return { message: 'Catégorie supprimée avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la suppression de la catégorie: ${message}`,
      );
    }
  }

  // Méthode pour initialiser les catégories par défaut
  async initializeDefaultCategories(): Promise<void> {
    try {
      const defaultCategories = [{ name: 'Collège' }, { name: 'Faculté' }];

      for (const category of defaultCategories) {
        const existingCategory = await this.classCategoryRepository.findOne({
          where: { name: category.name },
        });

        if (!existingCategory) {
          const newCategory = this.classCategoryRepository.create(category);
          await this.classCategoryRepository.save(newCategory);
        }
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      console.log(
        'Catégories par défaut déjà initialisées ou erreur:',
        message,
      );
    }
  }

  private mapToClassCategory(
    category: ClassCategory,
  ): ClassCategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}
