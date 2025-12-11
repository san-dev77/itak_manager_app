import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeachingAssignment } from '../../entities/teaching-assignment.entity';
import { Teacher } from '../../entities/teacher.entity';
import { ClassSubject } from '../../entities/class-subject.entity';
import { TeachingAssignmentResponseDto } from './dto/teaching-assignment.dto';
import {
  CreateTeachingAssignmentDto,
  UpdateTeachingAssignmentDto,
} from './dto/teaching-assignment.dto';

@Injectable()
export class TeachingAssignmentService {
  constructor(
    @InjectRepository(TeachingAssignment)
    private readonly teachingAssignmentRepository: Repository<TeachingAssignment>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    @InjectRepository(ClassSubject)
    private readonly classSubjectRepository: Repository<ClassSubject>,
  ) {}

  async createTeachingAssignment(
    createTeachingAssignmentDto: CreateTeachingAssignmentDto,
  ): Promise<TeachingAssignmentResponseDto> {
    try {
      // Vérifier si le professeur existe
      const teacher = await this.teacherRepository.findOne({
        where: { id: createTeachingAssignmentDto.teacherId },
      });

      if (!teacher) {
        throw new NotFoundException('Professeur non trouvé');
      }

      // Vérifier si l'association classe-matière existe
      const classSubject = await this.classSubjectRepository.findOne({
        where: { id: createTeachingAssignmentDto.classSubjectId },
      });

      if (!classSubject) {
        throw new NotFoundException('Association classe-matière non trouvée');
      }

      // Vérifier si l'affectation existe déjà
      const existingAssignment =
        await this.teachingAssignmentRepository.findOne({
          where: {
            teacherId: createTeachingAssignmentDto.teacherId,
            classSubjectId: createTeachingAssignmentDto.classSubjectId,
          },
        });

      if (existingAssignment) {
        throw new ConflictException(
          'Ce professeur est déjà affecté à cette classe-matière',
        );
      }

      // Vérifier que endDate est postérieure à startDate si elle est fournie
      if (createTeachingAssignmentDto.endDate) {
        const startDate = new Date(createTeachingAssignmentDto.startDate);
        const endDate = new Date(createTeachingAssignmentDto.endDate);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);

        if (endDate < startDate) {
          throw new BadRequestException(
            'La date de fin doit être postérieure ou égale à la date de début',
          );
        }
      }

      const teachingAssignment = this.teachingAssignmentRepository.create(
        createTeachingAssignmentDto,
      );
      const savedAssignment =
        await this.teachingAssignmentRepository.save(teachingAssignment);

      // Récupérer l'affectation avec les relations chargées
      const assignmentWithRelations =
        await this.teachingAssignmentRepository.findOne({
          where: { id: savedAssignment.id },
          relations: [
            'teacher',
            'teacher.user',
            'classSubject',
            'classSubject.class',
            'classSubject.subject',
          ],
        });

      if (!assignmentWithRelations) {
        throw new Error(
          "Erreur lors de la récupération de l'affectation créée",
        );
      }

      return this.mapToTeachingAssignmentResponseDto(assignmentWithRelations);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la création de l'affectation: ${message}`,
      );
    }
  }

  async getAllTeachingAssignments(): Promise<TeachingAssignmentResponseDto[]> {
    try {
      const assignments = await this.teachingAssignmentRepository.find({
        relations: [
          'teacher',
          'teacher.user',
          'classSubject',
          'classSubject.class',
          'classSubject.subject',
        ],
        order: { startDate: 'DESC' },
      });

      return assignments.map((assignment) =>
        this.mapToTeachingAssignmentResponseDto(assignment),
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération des affectations: ${message}`,
      );
    }
  }

  async getTeachingAssignmentById(
    id: string,
  ): Promise<TeachingAssignmentResponseDto> {
    try {
      const assignment = await this.teachingAssignmentRepository.findOne({
        where: { id },
        relations: [
          'teacher',
          'teacher.user',
          'classSubject',
          'classSubject.class',
          'classSubject.subject',
        ],
      });

      if (!assignment) {
        throw new NotFoundException('Affectation non trouvée');
      }

      return this.mapToTeachingAssignmentResponseDto(assignment);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération de l'affectation: ${message}`,
      );
    }
  }

  async getTeachingAssignmentsByTeacher(
    teacherId: string,
  ): Promise<TeachingAssignmentResponseDto[]> {
    try {
      const assignments = await this.teachingAssignmentRepository.find({
        where: { teacherId },
        relations: [
          'teacher',
          'teacher.user',
          'classSubject',
          'classSubject.class',
          'classSubject.subject',
        ],
        order: { startDate: 'DESC' },
      });

      return assignments.map((assignment) =>
        this.mapToTeachingAssignmentResponseDto(assignment),
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération des affectations du professeur: ${message}`,
      );
    }
  }

  async getTeachingAssignmentsByClassSubject(
    classSubjectId: string,
  ): Promise<TeachingAssignmentResponseDto[]> {
    try {
      const assignments = await this.teachingAssignmentRepository.find({
        where: { classSubjectId },
        relations: [
          'teacher',
          'teacher.user',
          'classSubject',
          'classSubject.class',
          'classSubject.subject',
        ],
        order: { startDate: 'DESC' },
      });

      return assignments.map((assignment) =>
        this.mapToTeachingAssignmentResponseDto(assignment),
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération des affectations pour la classe-matière: ${message}`,
      );
    }
  }

  async updateTeachingAssignment(
    id: string,
    updateTeachingAssignmentDto: UpdateTeachingAssignmentDto,
  ): Promise<TeachingAssignmentResponseDto> {
    try {
      // Vérifier que l'affectation existe
      await this.getTeachingAssignmentById(id);

      // Si le professeur est modifié, vérifier qu'il existe
      if (updateTeachingAssignmentDto.teacherId) {
        const teacher = await this.teacherRepository.findOne({
          where: { id: updateTeachingAssignmentDto.teacherId },
        });

        if (!teacher) {
          throw new NotFoundException('Professeur non trouvé');
        }
      }

      // Si l'association classe-matière est modifiée, vérifier qu'elle existe
      if (updateTeachingAssignmentDto.classSubjectId) {
        const classSubject = await this.classSubjectRepository.findOne({
          where: { id: updateTeachingAssignmentDto.classSubjectId },
        });

        if (!classSubject) {
          throw new NotFoundException('Association classe-matière non trouvée');
        }
      }

      // Vérifier si la nouvelle affectation existe déjà
      if (
        updateTeachingAssignmentDto.teacherId ||
        updateTeachingAssignmentDto.classSubjectId
      ) {
        const currentAssignment =
          await this.teachingAssignmentRepository.findOne({
            where: { id },
          });

        const newTeacherId =
          updateTeachingAssignmentDto.teacherId || currentAssignment?.teacherId;
        const newClassSubjectId =
          updateTeachingAssignmentDto.classSubjectId ||
          currentAssignment?.classSubjectId;

        const existingAssignment =
          await this.teachingAssignmentRepository.findOne({
            where: {
              teacherId: newTeacherId,
              classSubjectId: newClassSubjectId,
            },
          });

        if (existingAssignment && existingAssignment.id !== id) {
          throw new ConflictException(
            'Ce professeur est déjà affecté à cette classe-matière',
          );
        }
      }

      await this.teachingAssignmentRepository.update(
        id,
        updateTeachingAssignmentDto,
      );

      const updatedAssignment = await this.teachingAssignmentRepository.findOne(
        {
          where: { id },
          relations: [
            'teacher',
            'teacher.user',
            'classSubject',
            'classSubject.class',
            'classSubject.subject',
          ],
        },
      );

      if (!updatedAssignment) {
        throw new NotFoundException(
          'Affectation non trouvée après mise à jour',
        );
      }

      return this.mapToTeachingAssignmentResponseDto(updatedAssignment);
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
        `Erreur lors de la mise à jour de l'affectation: ${message}`,
      );
    }
  }

  async deleteTeachingAssignment(id: string): Promise<{ message: string }> {
    try {
      // Vérifier que l'affectation existe
      await this.getTeachingAssignmentById(id);

      await this.teachingAssignmentRepository.delete(id);

      return { message: 'Affectation supprimée avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la suppression de l'affectation: ${message}`,
      );
    }
  }

  private mapToTeachingAssignmentResponseDto(
    assignment: TeachingAssignment,
  ): TeachingAssignmentResponseDto {
    return {
      id: assignment.id,
      startDate: assignment.startDate,
      endDate: assignment.endDate,
      coefficient: assignment.classSubject?.coefficient,
      class: assignment.classSubject?.class,
      subject: assignment.classSubject?.subject,
      createdAt: assignment.createdAt,
      updatedAt: assignment.updatedAt,
      teacher: {
        id: assignment.teacher.id,
        matricule: assignment.teacher.matricule || '',
        hireDate: assignment.teacher.hireDate,
        subjects: assignment.teacher.subjects || [],
        createdAt: assignment.teacher.createdAt,
        updatedAt: assignment.teacher.updatedAt,
        user: {
          id: assignment.teacher.user.id,
          username: assignment.teacher.user.username,
          firstName: assignment.teacher.user.firstName,
          lastName: assignment.teacher.user.lastName,
          gender: assignment.teacher.user.gender,
          birthDate: assignment.teacher.user.birthDate,
          phone: assignment.teacher.user.phone,
          role: assignment.teacher.user.role,
          isActive: assignment.teacher.user.isActive,
          email: assignment.teacher.user.email,
          createdAt: assignment.teacher.user.createdAt,
          updatedAt: assignment.teacher.user.updatedAt,
        },
      },
      classSubject: assignment.classSubject
        ? {
            id: assignment.classSubject.id,
            coefficient: assignment.classSubject.coefficient,
            classId: assignment.classSubject.classId,
            subjectId: assignment.classSubject.subjectId,
            weeklyHours: assignment.classSubject.weeklyHours,
            isOptional: assignment.classSubject.isOptional,
            createdAt: assignment.classSubject.createdAt,
            updatedAt: assignment.classSubject.updatedAt,
            class: assignment.classSubject.class
              ? {
                  id: assignment.classSubject.class.id,
                  name: assignment.classSubject.class.name,
                  code: assignment.classSubject.class.code,
                  description: assignment.classSubject.class.description,
                }
              : undefined,
            subject: assignment.classSubject.subject
              ? {
                  id: assignment.classSubject.subject.id,
                  name: assignment.classSubject.subject.name,
                  code: assignment.classSubject.subject.code,
                }
              : undefined,
          }
        : undefined,
    };
  }
}
