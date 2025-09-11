import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Teacher } from '../../entities/teacher.entity';
import { User } from '../../entities/user.entity';
import { Subject } from '../../entities/subject.entity';
import {
  CreateTeacherDto,
  UpdateTeacherDto,
  TeacherResponseDto,
} from './dto/teacher.dto';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,
  ) {}

  async createTeacher(
    createTeacherDto: CreateTeacherDto,
  ): Promise<TeacherResponseDto> {
    try {
      // Vérifier si l'utilisateur existe
      const user = await this.userRepository.findOne({
        where: { id: createTeacherDto.userId },
      });

      if (!user) {
        throw new NotFoundException('Utilisateur non trouvé');
      }

      // Vérifier si le matricule existe déjà
      const existingTeacher = await this.teacherRepository.findOne({
        where: { matricule: createTeacherDto.matricule },
      });

      if (existingTeacher) {
        throw new ConflictException('Ce matricule existe déjà');
      }

      // Vérifier si l'utilisateur n'est pas déjà enseignant
      const teacherExists = await this.teacherRepository.findOne({
        where: { userId: createTeacherDto.userId },
      });

      if (teacherExists) {
        throw new ConflictException(
          'Cet utilisateur est déjà enregistré comme enseignant',
        );
      }

      // Gérer les matières si spécifiées
      let subjects: Subject[] = [];
      if (
        createTeacherDto.subjectIds &&
        createTeacherDto.subjectIds.length > 0
      ) {
        subjects = await this.subjectRepository.find({
          where: { id: In(createTeacherDto.subjectIds) },
        });
      }

      // Créer l'enseignant
      const teacher = this.teacherRepository.create({
        userId: createTeacherDto.userId,
        matricule: createTeacherDto.matricule,
        hireDate: new Date(createTeacherDto.hireDate),
        photo: createTeacherDto.photo,
        maritalStatus: createTeacherDto.maritalStatus,
        diplomas: createTeacherDto.diplomas,
        address: createTeacherDto.address,
        emergencyContact: createTeacherDto.emergencyContact,
        notes: createTeacherDto.notes,
        subjects,
      });

      const savedTeacher = await this.teacherRepository.save(teacher);

      // Récupérer l'enseignant avec toutes les relations
      const teacherWithRelations = await this.teacherRepository.findOne({
        where: { id: savedTeacher.id },
        relations: ['user', 'subjects'],
      });

      return this.mapToTeacherResponse(teacherWithRelations!);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(`Erreur lors de la création de l'enseignant: ${message}`);
    }
  }

  async getAllTeachers(): Promise<TeacherResponseDto[]> {
    try {
      const teachers = await this.teacherRepository.find({
        relations: ['user'],
        order: { createdAt: 'DESC' },
      });

      return teachers.map((teacher) => this.mapToTeacherResponse(teacher));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération des enseignants: ${message}`,
      );
    }
  }

  async getTeacherById(id: string): Promise<TeacherResponseDto> {
    try {
      const teacher = await this.teacherRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!teacher) {
        throw new NotFoundException('Enseignant non trouvé');
      }

      return this.mapToTeacherResponse(teacher);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération de l'enseignant: ${message}`,
      );
    }
  }

  async getTeacherByUserId(userId: string): Promise<TeacherResponseDto> {
    try {
      const teacher = await this.teacherRepository.findOne({
        where: { userId },
        relations: ['user'],
      });

      if (!teacher) {
        throw new NotFoundException('Enseignant non trouvé');
      }

      return this.mapToTeacherResponse(teacher);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération de l'enseignant: ${message}`,
      );
    }
  }

  async getTeacherByMatricule(matricule: string): Promise<TeacherResponseDto> {
    try {
      const teacher = await this.teacherRepository.findOne({
        where: { matricule },
        relations: ['user'],
      });

      if (!teacher) {
        throw new NotFoundException('Enseignant non trouvé');
      }

      return this.mapToTeacherResponse(teacher);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération de l'enseignant: ${message}`,
      );
    }
  }

  async getTeachersBySubject(subjectId: string): Promise<TeacherResponseDto[]> {
    try {
      const teachers = await this.teacherRepository.find({
        where: {
          subjects: {
            id: subjectId,
          },
        },
        relations: ['user', 'subjects'],
        order: { createdAt: 'DESC' },
      });

      return teachers.map((teacher) => this.mapToTeacherResponse(teacher));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération des enseignants: ${message}`,
      );
    }
  }

  async updateTeacher(
    id: string,
    updateTeacherDto: UpdateTeacherDto,
  ): Promise<TeacherResponseDto> {
    try {
      // Vérifier que l'enseignant existe
      await this.getTeacherById(id);

      // Mettre à jour l'enseignant
      const updateData = { ...updateTeacherDto };
      if (updateTeacherDto.hireDate) {
        updateData.hireDate = updateTeacherDto.hireDate;
      }

      await this.teacherRepository.update(id, updateData);

      // Récupérer l'enseignant mis à jour
      const updatedTeacher = await this.teacherRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!updatedTeacher) {
        throw new NotFoundException('Enseignant non trouvé après mise à jour');
      }

      return this.mapToTeacherResponse(updatedTeacher);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la mise à jour de l'enseignant: ${message}`,
      );
    }
  }

  async deleteTeacher(id: string): Promise<{ message: string }> {
    try {
      // Vérifier que l'enseignant existe
      await this.getTeacherById(id);

      await this.teacherRepository.delete(id);

      return { message: 'Enseignant supprimé avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la suppression de l'enseignant: ${message}`,
      );
    }
  }

  private mapToTeacherResponse(teacher: Teacher): TeacherResponseDto {
    return {
      id: teacher.id,
      matricule: teacher.matricule,
      hireDate: teacher.hireDate,
      photo: teacher.photo,
      maritalStatus: teacher.maritalStatus,
      subjects: teacher.subjects || [],
      diplomas: teacher.diplomas,
      address: teacher.address,
      emergencyContact: teacher.emergencyContact,
      notes: teacher.notes,
      createdAt: teacher.createdAt,
      updatedAt: teacher.updatedAt,
      user: {
        id: teacher.user.id,
        username: teacher.user.username,
        email: teacher.user.email,
        firstName: teacher.user.firstName,
        lastName: teacher.user.lastName,
        gender: teacher.user.gender,
        birthDate: teacher.user.birthDate,
        phone: teacher.user.phone,
        role: teacher.user.role,
        isActive: teacher.user.isActive,
        createdAt: teacher.user.createdAt,
        updatedAt: teacher.user.updatedAt,
      },
    };
  }
}
