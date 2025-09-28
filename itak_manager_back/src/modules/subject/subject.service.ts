import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from '../../entities/subject.entity';
import {
  CreateSubjectDto,
  UpdateSubjectDto,
  SubjectResponseDto,
} from './dto/subject.dto';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  async createSubject(
    createSubjectDto: CreateSubjectDto,
  ): Promise<SubjectResponseDto> {
    try {
      // Vérifier si le code existe déjà
      const existingSubject = await this.subjectRepository.findOne({
        where: { code: createSubjectDto.code },
      });

      if (existingSubject) {
        throw new ConflictException('Une matière avec ce code existe déjà');
      }

      // Vérifier si le nom existe déjà
      const existingSubjectName = await this.subjectRepository.findOne({
        where: { name: createSubjectDto.name },
      });

      if (existingSubjectName) {
        throw new ConflictException('Une matière avec ce nom existe déjà');
      }

      const subject = this.subjectRepository.create(createSubjectDto);
      const savedSubject = await this.subjectRepository.save(subject);

      return this.mapToSubjectResponseDto(savedSubject);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(`Erreur lors de la création de la matière: ${message}`);
    }
  }

  async getAllSubjects(): Promise<SubjectResponseDto[]> {
    try {
      const subjects = await this.subjectRepository.find({
        order: { createdAt: 'DESC' },
      });

      return subjects.map((subject) => this.mapToSubjectResponseDto(subject));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération des matières: ${message}`,
      );
    }
  }

  async getSubjectById(id: string): Promise<SubjectResponseDto> {
    try {
      const subject = await this.subjectRepository.findOne({
        where: { id },
      });

      if (!subject) {
        throw new NotFoundException('Matière non trouvée');
      }

      return this.mapToSubjectResponseDto(subject);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération de la matière: ${message}`,
      );
    }
  }

  async getSubjectByCode(code: string): Promise<SubjectResponseDto> {
    try {
      const subject = await this.subjectRepository.findOne({
        where: { code },
      });

      if (!subject) {
        throw new NotFoundException('Matière non trouvée');
      }

      return this.mapToSubjectResponseDto(subject);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération de la matière: ${message}`,
      );
    }
  }

  async getSubjectsByName(name: string): Promise<SubjectResponseDto[]> {
    try {
      const subjects = await this.subjectRepository.find({
        where: { name: name },
        order: { name: 'ASC' },
      });

      return subjects.map((subject) => this.mapToSubjectResponseDto(subject));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération des matières: ${message}`,
      );
    }
  }

  async updateSubject(
    id: string,
    updateSubjectDto: UpdateSubjectDto,
  ): Promise<SubjectResponseDto> {
    try {
      // Vérifier que la matière existe
      await this.getSubjectById(id);

      // Si le code est modifié, vérifier qu'il n'existe pas déjà
      if (updateSubjectDto.code) {
        const existingSubject = await this.subjectRepository.findOne({
          where: { code: updateSubjectDto.code },
        });

        if (existingSubject && existingSubject.id !== id) {
          throw new ConflictException('Une matière avec ce code existe déjà');
        }
      }

      // Si le nom est modifié, vérifier qu'il n'existe pas déjà
      if (updateSubjectDto.name) {
        const existingSubjectName = await this.subjectRepository.findOne({
          where: { name: updateSubjectDto.name },
        });

        if (existingSubjectName && existingSubjectName.id !== id) {
          throw new ConflictException('Une matière avec ce nom existe déjà');
        }
      }

      await this.subjectRepository.update(id, updateSubjectDto);

      const updatedSubject = await this.subjectRepository.findOne({
        where: { id },
      });

      if (!updatedSubject) {
        throw new NotFoundException('Matière non trouvée après mise à jour');
      }

      return this.mapToSubjectResponseDto(updatedSubject);
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
        `Erreur lors de la mise à jour de la matière: ${message}`,
      );
    }
  }

  async deleteSubject(id: string): Promise<{ message: string }> {
    try {
      // Vérifier que la matière existe
      await this.getSubjectById(id);

      await this.subjectRepository.delete(id);

      return { message: 'Matière supprimée avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la suppression de la matière: ${message}`,
      );
    }
  }

  private mapToSubjectResponseDto(subject: Subject): SubjectResponseDto {
    return {
      id: subject.id,
      name: subject.name,
      code: subject.code,
      createdAt: subject.createdAt,
      updatedAt: subject.updatedAt,
    };
  }
}
