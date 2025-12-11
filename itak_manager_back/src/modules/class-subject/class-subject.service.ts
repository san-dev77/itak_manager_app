import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassSubject } from '../../entities/class-subject.entity';
import { Class } from '../../entities/class.entity';
import { Subject } from '../../entities/subject.entity';
import {
  CreateClassSubjectDto,
  UpdateClassSubjectDto,
  ClassSubjectResponseDto,
} from './dto/class-subject.dto';

@Injectable()
export class ClassSubjectService {
  constructor(
    @InjectRepository(ClassSubject)
    private readonly classSubjectRepository: Repository<ClassSubject>,
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  async createClassSubject(
    createClassSubjectDto: CreateClassSubjectDto,
  ): Promise<ClassSubjectResponseDto> {
    try {
      // Vérifier si la classe existe
      const classEntity = await this.classRepository.findOne({
        where: { id: createClassSubjectDto.classId },
      });

      if (!classEntity) {
        throw new NotFoundException('Classe non trouvée');
      }

      // Vérifier si la matière existe
      const subjectEntity = await this.subjectRepository.findOne({
        where: { id: createClassSubjectDto.subjectId },
      });

      if (!subjectEntity) {
        throw new NotFoundException('Matière non trouvée');
      }

      // Vérifier si l'association existe déjà
      const existingClassSubject = await this.classSubjectRepository.findOne({
        where: {
          classId: createClassSubjectDto.classId,
          subjectId: createClassSubjectDto.subjectId,
        },
      });

      if (existingClassSubject) {
        throw new ConflictException(
          'Cette matière est déjà associée à cette classe',
        );
      }

      const classSubject = this.classSubjectRepository.create(
        createClassSubjectDto,
      );
      const savedClassSubject =
        await this.classSubjectRepository.save(classSubject);

      // Récupérer l'association avec les relations chargées
      const classSubjectWithRelations =
        await this.classSubjectRepository.findOne({
          where: { id: savedClassSubject.id },
          relations: ['class', 'subject'],
        });

      if (!classSubjectWithRelations) {
        throw new Error(
          "Erreur lors de la récupération de l'association créée",
        );
      }

      return this.mapToClassSubject(classSubjectWithRelations);
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
        `Erreur lors de la création de l'association classe-matière: ${message}`,
      );
    }
  }

  async getAllClassSubjects(): Promise<ClassSubjectResponseDto[]> {
    try {
      const classSubjects = await this.classSubjectRepository.find({
        relations: ['class', 'subject'],
        order: { createdAt: 'DESC' },
      });

      return classSubjects.map((classSubject) =>
        this.mapToClassSubject(classSubject),
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération des associations classe-matière: ${message}`,
      );
    }
  }

  async getClassSubjectById(id: string): Promise<ClassSubjectResponseDto> {
    try {
      const classSubject = await this.classSubjectRepository.findOne({
        where: { id },
        relations: ['class', 'subject'],
      });

      if (!classSubject) {
        throw new NotFoundException('Association classe-matière non trouvée');
      }

      return this.mapToClassSubject(classSubject);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération de l'association classe-matière: ${message}`,
      );
    }
  }

  async getClassSubjectsByClass(
    classId: string,
  ): Promise<ClassSubjectResponseDto[]> {
    try {
      const classSubjects = await this.classSubjectRepository.find({
        where: { classId },
        relations: ['class', 'subject'],
        order: { createdAt: 'DESC' },
      });

      return classSubjects.map((classSubject) =>
        this.mapToClassSubject(classSubject),
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération des matières de la classe: ${message}`,
      );
    }
  }

  async getClassSubjectsBySubject(
    subjectId: string,
  ): Promise<ClassSubjectResponseDto[]> {
    try {
      const classSubjects = await this.classSubjectRepository.find({
        where: { subjectId },
        relations: ['class', 'subject'],
        order: { createdAt: 'DESC' },
      });

      return classSubjects.map((classSubject) =>
        this.mapToClassSubject(classSubject),
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération des classes pour la matière: ${message}`,
      );
    }
  }

  async updateClassSubject(
    id: string,
    updateClassSubjectDto: UpdateClassSubjectDto,
  ): Promise<ClassSubjectResponseDto> {
    try {
      // Vérifier que l'association existe
      await this.getClassSubjectById(id);

      // Si la classe est modifiée, vérifier qu'elle existe
      if (updateClassSubjectDto.classId) {
        const classEntity = await this.classRepository.findOne({
          where: { id: updateClassSubjectDto.classId },
        });

        if (!classEntity) {
          throw new NotFoundException('Classe non trouvée');
        }
      }

      // Si la matière est modifiée, vérifier qu'elle existe
      if (updateClassSubjectDto.subjectId) {
        const subjectEntity = await this.subjectRepository.findOne({
          where: { id: updateClassSubjectDto.subjectId },
        });

        if (!subjectEntity) {
          throw new NotFoundException('Matière non trouvée');
        }
      }

      // Vérifier si la nouvelle association existe déjà
      if (updateClassSubjectDto.classId || updateClassSubjectDto.subjectId) {
        const currentClassSubject = await this.classSubjectRepository.findOne({
          where: { id },
        });

        const newClassId =
          updateClassSubjectDto.classId || currentClassSubject?.classId;
        const newSubjectId =
          updateClassSubjectDto.subjectId || currentClassSubject?.subjectId;

        const existingClassSubject = await this.classSubjectRepository.findOne({
          where: {
            classId: newClassId,
            subjectId: newSubjectId,
          },
        });

        if (existingClassSubject && existingClassSubject.id !== id) {
          throw new ConflictException(
            'Cette matière est déjà associée à cette classe',
          );
        }
      }

      await this.classSubjectRepository.update(id, updateClassSubjectDto);

      const updatedClassSubject = await this.classSubjectRepository.findOne({
        where: { id },
        relations: ['class', 'subject'],
      });

      if (!updatedClassSubject) {
        throw new NotFoundException(
          'Association classe-matière non trouvée après mise à jour',
        );
      }

      return this.mapToClassSubject(updatedClassSubject);
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
        `Erreur lors de la mise à jour de l'association classe-matière: ${message}`,
      );
    }
  }

  async deleteClassSubject(id: string): Promise<{ message: string }> {
    try {
      // Vérifier que l'association existe
      await this.getClassSubjectById(id);

      await this.classSubjectRepository.delete(id);

      return { message: 'Association classe-matière supprimée avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la suppression de l'association classe-matière: ${message}`,
      );
    }
  }

  private mapToClassSubject(
    classSubject: ClassSubject,
  ): ClassSubjectResponseDto {
    return {
      id: classSubject.id,
      classId: classSubject.classId,
      subjectId: classSubject.subjectId,
      coefficient: classSubject.coefficient,
      weeklyHours: classSubject.weeklyHours,
      isOptional: classSubject.isOptional,
      createdAt: classSubject.createdAt,
      updatedAt: classSubject.updatedAt,
      class: {
        id: classSubject.class.id,
        name: classSubject.class.name,
        code: classSubject.class.code,
        description: classSubject.class.description,
      },
      subject: {
        id: classSubject.subject.id,
        name: classSubject.subject.name,
        code: classSubject.subject.code,
      },
    };
  }
}
