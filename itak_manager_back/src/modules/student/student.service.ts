import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../../entities/student.entity';
import { User } from '../../entities/user.entity';
import {
  CreateStudentDto,
  UpdateStudentDto,
  StudentResponseDto,
} from './dto/student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createStudent(
    createStudentDto: CreateStudentDto,
  ): Promise<StudentResponseDto> {
    try {
      // Vérifier si l'utilisateur existe
      const user = await this.userRepository.findOne({
        where: { id: createStudentDto.userId },
      });

      if (!user) {
        throw new NotFoundException('Utilisateur non trouvé');
      }

      // Vérifier si le matricule existe déjà
      const existingStudent = await this.studentRepository.findOne({
        where: { matricule: createStudentDto.matricule },
      });

      if (existingStudent) {
        throw new ConflictException(
          'Un étudiant avec ce matricule existe déjà',
        );
      }

      // Vérifier si l'utilisateur est déjà étudiant
      const studentExists = await this.studentRepository.findOne({
        where: { userId: createStudentDto.userId },
      });

      if (studentExists) {
        throw new ConflictException(
          'Cet utilisateur est déjà enregistré comme étudiant',
        );
      }

      // Créer l'étudiant
      const student = this.studentRepository.create({
        ...createStudentDto,
        enrollmentDate: createStudentDto.enrollmentDate,
      });

      const savedStudent = await this.studentRepository.save(student);
      return this.mapToStudentResponseDto(savedStudent);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(`Erreur lors de la création de l'étudiant: ${message}`);
    }
  }

  async getAllStudents(): Promise<StudentResponseDto[]> {
    try {
      const students = await this.studentRepository.find({
        relations: ['user'],
        order: { createdAt: 'DESC' },
      });

      return students.map((student) => this.mapToStudentResponseDto(student));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération des étudiants: ${message}`,
      );
    }
  }

  async getStudentById(id: string): Promise<StudentResponseDto> {
    try {
      const student = await this.studentRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!student) {
        throw new NotFoundException('Étudiant non trouvé');
      }

      return this.mapToStudentResponseDto(student);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération de l'étudiant: ${message}`,
      );
    }
  }

  async getStudentByUserId(userId: string): Promise<StudentResponseDto> {
    try {
      const student = await this.studentRepository.findOne({
        where: { userId },
        relations: ['user'],
      });

      if (!student) {
        throw new NotFoundException('Étudiant non trouvé');
      }

      return this.mapToStudentResponseDto(student);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération de l'étudiant: ${message}`,
      );
    }
  }

  async getStudentByMatricule(matricule: string): Promise<StudentResponseDto> {
    try {
      const student = await this.studentRepository.findOne({
        where: { matricule },
        relations: ['user'],
      });

      if (!student) {
        throw new NotFoundException('Étudiant non trouvé');
      }

      return this.mapToStudentResponseDto(student);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération de l'étudiant: ${message}`,
      );
    }
  }

  async updateStudent(
    id: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<StudentResponseDto> {
    try {
      // Vérifier que l'étudiant existe
      await this.getStudentById(id);

      // Si le matricule est modifié, vérifier qu'il n'existe pas déjà
      if (updateStudentDto.matricule) {
        const existingStudent = await this.studentRepository.findOne({
          where: { matricule: updateStudentDto.matricule },
        });

        if (existingStudent && existingStudent.id !== id) {
          throw new ConflictException(
            'Un étudiant avec ce matricule existe déjà',
          );
        }
      }

      // Mettre à jour l'étudiant
      const updateData = { ...updateStudentDto };
      if (updateStudentDto.enrollmentDate) {
        updateData.enrollmentDate = updateStudentDto.enrollmentDate;
      }

      await this.studentRepository.update(id, updateData);

      // Récupérer l'étudiant mis à jour
      const updatedStudent = await this.studentRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!updatedStudent) {
        throw new NotFoundException('Étudiant non trouvé après mise à jour');
      }

      return this.mapToStudentResponseDto(updatedStudent);
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
        `Erreur lors de la mise à jour de l'étudiant: ${message}`,
      );
    }
  }

  async deleteStudent(id: string): Promise<{ message: string }> {
    try {
      // Vérifier que l'étudiant existe
      await this.getStudentById(id);

      await this.studentRepository.delete(id);

      return { message: 'Étudiant supprimé avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la suppression de l'étudiant: ${message}`,
      );
    }
  }

  private mapToStudentResponseDto(student: Student): StudentResponseDto {
    return {
      id: student.id,
      userId: student.userId,
      matricule: student.matricule,
      enrollmentDate: student.enrollmentDate,
      photo: student.photo,
      maritalStatus: student.maritalStatus,
      fatherName: student.fatherName,
      motherName: student.motherName,
      tutorName: student.tutorName,
      tutorPhone: student.tutorPhone,
      address: student.address,
      emergencyContact: student.emergencyContact,
      notes: student.notes,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
      user: {
        id: student.user.id,
        username: student.user.username,
        email: student.user.email,
        firstName: student.user.firstName,
        lastName: student.user.lastName,
        gender: student.user.gender,
        birthDate: student.user.birthDate,
        phone: student.user.phone,
        role: student.user.role,
        isActive: student.user.isActive,
        createdAt: student.user.createdAt,
        updatedAt: student.user.updatedAt,
      },
    };
  }
}
