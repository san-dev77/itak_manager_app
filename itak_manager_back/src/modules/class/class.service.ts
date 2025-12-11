import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from '../../entities/class.entity';
import { ClassCategory } from '../../entities/class-category.entity';
import {
  ClassResponseDto,
  CreateClassDto,
  UpdateClassDto,
} from './dto/class.dto';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(ClassCategory)
    private readonly classCategoryRepository: Repository<ClassCategory>,
  ) {}

  async createClass(createClassDto: CreateClassDto): Promise<ClassResponseDto> {
    try {
      // Vérifier si le code existe déjà
      const existingClass = await this.classRepository.findOne({
        where: { code: createClassDto.code },
      });

      if (existingClass) {
        throw new ConflictException('Une classe avec ce code existe déjà');
      }

      // Vérifier si le nom existe déjà
      const existingClassName = await this.classRepository.findOne({
        where: { name: createClassDto.name },
      });

      if (existingClassName) {
        throw new ConflictException('Une classe avec ce nom existe déjà');
      }

      // Récupérer la catégorie de classe
      const classCategory = await this.classCategoryRepository.findOne({
        where: { id: createClassDto.classCategoryId },
      });

      if (!classCategory) {
        throw new NotFoundException('Catégorie de classe non trouvée');
      }

      const classEntity = this.classRepository.create({
        ...createClassDto,
        classCategory: classCategory,
      });
      const savedClass = await this.classRepository.save(classEntity);

      // Récupérer la classe avec la relation classCategory
      const classWithCategory = await this.classRepository.findOne({
        where: { id: savedClass.id },
        relations: ['classCategory'],
      });

      if (!classWithCategory) {
        throw new Error('Erreur lors de la récupération de la classe créée');
      }

      return this.mapToClassResponseDto(classWithCategory);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(`Erreur lors de la création de la classe: ${message}`);
    }
  }

  async getAllClasses(): Promise<ClassResponseDto[]> {
    try {
      const classes = await this.classRepository.find({
        relations: ['classCategory'],
        order: { createdAt: 'DESC' },
      });

      return classes.map((classEntity) =>
        this.mapToClassResponseDto(classEntity),
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(`Erreur lors de la récupération des classes: ${message}`);
    }
  }

  async getClassById(id: string): Promise<ClassResponseDto> {
    try {
      const classEntity = await this.classRepository.findOne({
        where: { id },
        relations: ['classCategory'],
      });

      if (!classEntity) {
        throw new NotFoundException('Classe non trouvée');
      }

      return this.mapToClassResponseDto(classEntity);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération de la classe: ${message}`,
      );
    }
  }

  async getClassByCode(code: string): Promise<ClassResponseDto> {
    try {
      const classEntity = await this.classRepository.findOne({
        where: { code },
      });

      if (!classEntity) {
        throw new NotFoundException('Classe non trouvée');
      }

      return this.mapToClassResponseDto(classEntity);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération de la classe: ${message}`,
      );
    }
  }

  async getClassByName(name: string): Promise<ClassResponseDto> {
    try {
      const classEntity = await this.classRepository.findOne({
        where: { name },
      });

      if (!classEntity) {
        throw new NotFoundException('Classe non trouvée');
      }

      return this.mapToClassResponseDto(classEntity);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération de la classe: ${message}`,
      );
    }
  }

  async updateClass(
    id: string,
    updateClassDto: UpdateClassDto,
  ): Promise<ClassResponseDto> {
    try {
      // Vérifier que la classe existe
      await this.getClassById(id);

      // Si le code est modifié, vérifier qu'il n'existe pas déjà
      if (updateClassDto.code) {
        const existingClass = await this.classRepository.findOne({
          where: { code: updateClassDto.code },
        });

        if (existingClass && existingClass.id !== id) {
          throw new ConflictException('Une classe avec ce code existe déjà');
        }
      }

      // Si le nom est modifié, vérifier qu'il n'existe pas déjà
      if (updateClassDto.name) {
        const existingClassName = await this.classRepository.findOne({
          where: { name: updateClassDto.name },
        });

        if (existingClassName && existingClassName.id !== id) {
          throw new ConflictException('Une classe avec ce nom existe déjà');
        }
      }

      const updateData: any = { ...updateClassDto };
      if (updateClassDto.classCategoryId) {
        // Récupérer la catégorie de classe
        const classCategory = await this.classCategoryRepository.findOne({
          where: { id: updateClassDto.classCategoryId },
        });

        if (!classCategory) {
          throw new NotFoundException('Catégorie de classe non trouvée');
        }

        updateData.classCategory = classCategory;
        delete updateData.classCategoryId;
      }

      await this.classRepository.update(id, updateData);

      const updatedClass = await this.classRepository.findOne({
        where: { id },
        relations: ['classCategory'],
      });

      if (!updatedClass) {
        throw new NotFoundException('Classe non trouvée après mise à jour');
      }

      return this.mapToClassResponseDto(updatedClass);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(`Erreur lors de la mise à jour de la classe: ${message}`);
    }
  }

  async deleteClass(id: string): Promise<{ message: string }> {
    try {
      // Vérifier que la classe existe
      await this.getClassById(id);

      await this.classRepository.delete(id);

      return { message: 'Classe supprimée avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(`Erreur lors de la suppression de la classe: ${message}`);
    }
  }

  async getClassesByCategory(categoryId: string): Promise<ClassResponseDto[]> {
    try {
      const classes = await this.classRepository.find({
        where: { classCategory: { id: categoryId } },
        relations: ['classCategory'],
        order: { createdAt: 'DESC' },
      });

      return classes.map((classEntity) =>
        this.mapToClassResponseDto(classEntity),
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération des classes par catégorie: ${message}`,
      );
    }
  }

  getClassesByLevel(level: string): Promise<ClassResponseDto[]> {
    try {
      // Note: Since Class entity doesn't have level field, this method returns empty array
      // This might need to be implemented differently based on business logic
      return Promise.resolve([]);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération des classes par niveau: ${message}`,
      );
    }
  }

  private mapToClassResponseDto(classEntity: Class): ClassResponseDto {
    return {
      id: classEntity.id,
      name: classEntity.name,
      code: classEntity.code,
      classCategory: classEntity.classCategory
        ? {
            id: classEntity.classCategory.id,
            name: classEntity.classCategory.name,
            institutionId: classEntity.classCategory.institutionId,
            createdAt: classEntity.classCategory.createdAt,
            updatedAt: classEntity.classCategory.updatedAt,
          }
        : null,
      description: classEntity.description,
      level: classEntity.level,
      capacity: classEntity.capacity,
      orderLevel: classEntity.orderLevel,
      createdAt: classEntity.createdAt,
      updatedAt: classEntity.updatedAt,
      classSubjects: classEntity.classSubjects || [],
      studentClasses: classEntity.studentClasses || [],
    };
  }
}
