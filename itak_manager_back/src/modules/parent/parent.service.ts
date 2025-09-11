import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parent } from '../../entities/parent.entity';
import { User } from '../../entities/user.entity';
import { Student } from '../../entities/student.entity';
import { StudentParent } from '../../entities/student-parent.entity';
import {
  CreateParentDto,
  UpdateParentDto,
  ParentResponseDto,
  CreateStudentParentDto,
  StudentParentResponseDto,
} from './dto/parent.dto';

@Injectable()
export class ParentService {
  constructor(
    @InjectRepository(Parent)
    private parentRepository: Repository<Parent>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(StudentParent)
    private studentParentRepository: Repository<StudentParent>,
  ) {}

  async createParent(
    createParentDto: CreateParentDto,
  ): Promise<ParentResponseDto> {
    try {
      // Vérifier si l'utilisateur existe
      const user = await this.userRepository.findOne({
        where: { id: createParentDto.userId },
      });

      if (!user) {
        throw new NotFoundException('Utilisateur non trouvé');
      }

      // Vérifier si l'utilisateur n'est pas déjà parent
      const parentExists = await this.parentRepository.findOne({
        where: { userId: createParentDto.userId },
      });

      if (parentExists) {
        throw new ConflictException(
          'Cet utilisateur est déjà enregistré comme parent',
        );
      }

      // Créer le parent
      const parent = this.parentRepository.create({
        userId: createParentDto.userId,
        job: createParentDto.job,
      });

      const savedParent = await this.parentRepository.save(parent);

      // Récupérer le parent avec les relations
      const parentWithRelations = await this.parentRepository.findOne({
        where: { id: savedParent.id },
        relations: ['user'],
      });

      return this.mapToParentResponse(parentWithRelations!);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(`Erreur lors de la création du parent: ${message}`);
    }
  }

  async getAllParents(): Promise<ParentResponseDto[]> {
    try {
      const parents = await this.parentRepository.find({
        relations: ['user'],
        order: { createdAt: 'DESC' },
      });

      return parents.map((parent) => this.mapToParentResponse(parent));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(`Erreur lors de la récupération des parents: ${message}`);
    }
  }

  async getParentById(id: string): Promise<ParentResponseDto> {
    try {
      const parent = await this.parentRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!parent) {
        throw new NotFoundException('Parent non trouvé');
      }

      return this.mapToParentResponse(parent);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(`Erreur lors de la récupération du parent: ${message}`);
    }
  }

  async updateParent(
    id: string,
    updateParentDto: UpdateParentDto,
  ): Promise<ParentResponseDto> {
    try {
      const parent = await this.parentRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!parent) {
        throw new NotFoundException('Parent non trouvé');
      }

      // Mettre à jour les champs
      Object.assign(parent, updateParentDto);

      const updatedParent = await this.parentRepository.save(parent);
      return this.mapToParentResponse(updatedParent);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(`Erreur lors de la mise à jour du parent: ${message}`);
    }
  }

  async deleteParent(id: string): Promise<void> {
    try {
      const parent = await this.parentRepository.findOne({
        where: { id },
      });

      if (!parent) {
        throw new NotFoundException('Parent non trouvé');
      }

      await this.parentRepository.remove(parent);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(`Erreur lors de la suppression du parent: ${message}`);
    }
  }

  async linkStudentToParent(
    createStudentParentDto: CreateStudentParentDto,
  ): Promise<StudentParentResponseDto> {
    try {
      // Vérifier si l'étudiant existe
      const student = await this.studentRepository.findOne({
        where: { id: createStudentParentDto.studentId },
      });

      if (!student) {
        throw new NotFoundException('Étudiant non trouvé');
      }

      // Vérifier si le parent existe
      const parent = await this.parentRepository.findOne({
        where: { id: createStudentParentDto.parentId },
      });

      if (!parent) {
        throw new NotFoundException('Parent non trouvé');
      }

      // Vérifier si la relation existe déjà
      const existingRelation = await this.studentParentRepository.findOne({
        where: {
          studentId: createStudentParentDto.studentId,
          parentId: createStudentParentDto.parentId,
        },
      });

      if (existingRelation) {
        throw new ConflictException(
          'Cette relation parent-étudiant existe déjà',
        );
      }

      // Créer la relation
      const studentParent = this.studentParentRepository.create({
        studentId: createStudentParentDto.studentId,
        parentId: createStudentParentDto.parentId,
        relationship: createStudentParentDto.relationship,
      });

      const savedRelation =
        await this.studentParentRepository.save(studentParent);
      return this.mapToStudentParentResponse(savedRelation);
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
        `Erreur lors de la création de la relation parent-étudiant: ${message}`,
      );
    }
  }

  async getStudentParents(
    studentId: string,
  ): Promise<StudentParentResponseDto[]> {
    try {
      const relations = await this.studentParentRepository.find({
        where: { studentId },
        relations: ['parent', 'parent.user', 'student', 'student.user'],
      });

      return relations.map((relation) =>
        this.mapToStudentParentResponse(relation),
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération des parents de l'étudiant: ${message}`,
      );
    }
  }

  private mapToParentResponse(parent: Parent): ParentResponseDto {
    return {
      id: parent.id,
      job: parent.job,
      createdAt: parent.createdAt,
      updatedAt: parent.updatedAt,
      user: parent.user
        ? {
            id: parent.user.id,
            username: parent.user.username,
            email: parent.user.email,
            firstName: parent.user.firstName,
            lastName: parent.user.lastName,
            gender: parent.user.gender,
            birthDate: parent.user.birthDate,
            phone: parent.user.phone,
            role: parent.user.role,
            isActive: parent.user.isActive,
            createdAt: parent.user.createdAt,
            updatedAt: parent.user.updatedAt,
          }
        : undefined,
    };
  }

  private mapToStudentParentResponse(
    studentParent: StudentParent,
  ): StudentParentResponseDto {
    return {
      id: studentParent.id,
      studentId: studentParent.studentId,
      parentId: studentParent.parentId,
      relationship: studentParent.relationship,
      createdAt: studentParent.createdAt,
      updatedAt: studentParent.updatedAt,
    };
  }
}
