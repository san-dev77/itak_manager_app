import {
  Injectable,
  NotFoundException,
  ConflictException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassCategory } from '../../entities/class-category.entity';
import { Institution } from '../../entities/institution.entity';
import {
  ClassCategoryResponseDto,
  CreateClassCategoryDto,
  UpdateClassCategoryDto,
} from './dto/class-category.dto';

@Injectable()
export class ClassCategoryService implements OnModuleInit {
  constructor(
    @InjectRepository(ClassCategory)
    private readonly classCategoryRepository: Repository<ClassCategory>,
    @InjectRepository(Institution)
    private readonly institutionRepository: Repository<Institution>,
  ) {}

  async onModuleInit() {
    await this.initializeInstitutionsAndCategories();
  }

  async getAllInstitutions(): Promise<Institution[]> {
    try {
      return await this.institutionRepository.find({
        order: { name: 'ASC' },
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération des institutions: ${message}`,
      );
    }
  }

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

  async getAllClassCategories(
    institutionId?: string,
  ): Promise<ClassCategoryResponseDto[]> {
    try {
      const where: any = {};
      if (institutionId) {
        where.institutionId = institutionId;
      }

      const categories = await this.classCategoryRepository.find({
        where,
        relations: ['institution'],
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
        relations: ['institution'],
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

  // Méthode pour initialiser les institutions et catégories par défaut
  async initializeInstitutionsAndCategories(): Promise<void> {
    try {
      // Créer les institutions ITAK et UPCD
      const itakInstitution = await this.findOrCreateInstitution({
        name: 'ITAK',
        code: 'ITAK',
        description: "Institut Technique l'Antidote de Kati (Lycée)",
      });

      const upcdInstitution = await this.findOrCreateInstitution({
        name: 'UPCD',
        code: 'UPCD',
        description: 'Université Privée (Faculté)',
      });

      console.log('✅ Institutions et catégories initialisées avec succès');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      console.error(
        "❌ Erreur lors de l'initialisation des institutions et catégories:",
        message,
      );
    }
  }

  private async findOrCreateInstitution(data: {
    name: string;
    code: string;
    description?: string;
  }): Promise<Institution> {
    let institution = await this.institutionRepository.findOne({
      where: { code: data.code },
    });

    if (!institution) {
      institution = this.institutionRepository.create(data);
      institution = await this.institutionRepository.save(institution);
    }

    return institution;
  }

  private async findOrCreateCategory(data: {
    name: string;
    institutionId: string;
  }): Promise<ClassCategory> {
    let category = await this.classCategoryRepository.findOne({
      where: { name: data.name },
    });

    if (!category) {
      category = this.classCategoryRepository.create({
        name: data.name,
        institutionId: data.institutionId,
      });
      category = await this.classCategoryRepository.save(category);
    } else if (!category.institutionId) {
      // Mettre à jour si la catégorie existe mais n'a pas d'institution
      category.institutionId = data.institutionId;
      category = await this.classCategoryRepository.save(category);
    }

    return category;
  }

  // Méthode pour initialiser les catégories par défaut (conservée pour compatibilité)
  async initializeDefaultCategories(): Promise<void> {
    await this.initializeInstitutionsAndCategories();
  }

  private mapToClassCategory(
    category: ClassCategory,
  ): ClassCategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      institutionId: category.institutionId,
      institution: category.institution
        ? {
            id: category.institution.id,
            name: category.institution.name,
            code: category.institution.code,
            description: category.institution.description,
          }
        : undefined,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}
