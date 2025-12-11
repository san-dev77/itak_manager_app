import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentClass } from '../../entities/student-class.entity';
import { Student } from '../../entities/student.entity';
import { Class } from '../../entities/class.entity';
import { StudentClassResponseDto } from './dto/student-class.dto';
import {
  CreateStudentClassDto,
  UpdateStudentClassDto,
} from './dto/student-class.dto';

@Injectable()
export class StudentClassService {
  constructor(
    @InjectRepository(StudentClass)
    private readonly studentClassRepository: Repository<StudentClass>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}

  async createStudentClass(
    createStudentClassDto: CreateStudentClassDto,
  ): Promise<StudentClassResponseDto> {
    try {
      // Vérifier si l'étudiant existe
      const student = await this.studentRepository.findOne({
        where: { id: createStudentClassDto.studentId },
      });

      if (!student) {
        throw new NotFoundException('Étudiant non trouvé');
      }

      // Vérifier si la classe existe
      const classEntity = await this.classRepository.findOne({
        where: { id: createStudentClassDto.classId },
      });

      if (!classEntity) {
        throw new NotFoundException('Classe non trouvée');
      }

      // Vérifier si l'association existe déjà
      const existingStudentClass = await this.studentClassRepository.findOne({
        where: {
          studentId: createStudentClassDto.studentId,
          classId: createStudentClassDto.classId,
        },
      });

      if (existingStudentClass) {
        throw new ConflictException(
          'Cet étudiant est déjà inscrit dans cette classe',
        );
      }

      // Valider que endDate est postérieure à startDate si elle est fournie
      if (createStudentClassDto.endDate) {
        const startDate = new Date(createStudentClassDto.startDate);
        const endDate = new Date(createStudentClassDto.endDate);

        if (endDate < startDate) {
          throw new ConflictException(
            'La date de fin doit être postérieure ou égale à la date de début',
          );
        }
      }

      // Générer l'année scolaire à partir de la date de début
      const startDate = new Date(createStudentClassDto.startDate);
      const year = startDate.getFullYear();
      const nextYear = year + 1;
      const schoolYear = `${year}-${nextYear}`;

      const studentClass = this.studentClassRepository.create({
        ...createStudentClassDto,
        year: schoolYear,
      });
      const savedStudentClass =
        await this.studentClassRepository.save(studentClass);

      //ici on récupère l'inscription avec les relations chargées
      const studentClassWithRelations =
        await this.studentClassRepository.findOne({
          where: { id: savedStudentClass.id },
          relations: ['student', 'student.user', 'class'],
        });

      if (!studentClassWithRelations) {
        throw new Error(
          "Erreur lors de la récupération de l'inscription créée",
        );
      }

      return this.mapToStudentClassResponseDto(studentClassWithRelations);
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
        `Erreur lors de la création de l'inscription: ${message}`,
      );
    }
  }

  async getAllStudentClasses(): Promise<StudentClassResponseDto[]> {
    try {
      const studentClasses = await this.studentClassRepository.find({
        relations: [
          'student',
          'student.user',
          'class',
          'class.classCategory',
          'class.classCategory.institution',
        ],
        order: { startDate: 'DESC' },
      });

      // Debug: vérifier si l'institution est chargée
      if (studentClasses.length > 0) {
        const firstClass = studentClasses[0];
        console.log('🔍 Backend - Classe chargée:', {
          hasClass: !!firstClass.class,
          hasClassCategory: !!firstClass.class?.classCategory,
          hasInstitution: !!firstClass.class?.classCategory?.institution,
          institution: firstClass.class?.classCategory?.institution,
        });
      }

      return studentClasses.map((studentClass) =>
        this.mapToStudentClassResponseDto(studentClass),
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération des inscriptions: ${message}`,
      );
    }
  }

  async getStudentClassById(id: string): Promise<StudentClassResponseDto> {
    try {
      const studentClass = await this.studentClassRepository.findOne({
        where: { id },
        relations: ['student', 'student.user', 'class'],
      });

      if (!studentClass) {
        throw new NotFoundException('Inscription non trouvée');
      }

      return this.mapToStudentClassResponseDto(studentClass);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération de l'inscription: ${message}`,
      );
    }
  }

  async getStudentClassesByStudent(
    studentId: string,
  ): Promise<StudentClassResponseDto[]> {
    try {
      const studentClasses = await this.studentClassRepository.find({
        where: { studentId },
        relations: ['student', 'student.user', 'class'],
        order: { startDate: 'DESC' },
      });

      return studentClasses.map((studentClass) =>
        this.mapToStudentClassResponseDto(studentClass),
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération des classes de l'étudiant: ${message}`,
      );
    }
  }

  async getStudentClassesByClass(
    classId: string,
  ): Promise<StudentClassResponseDto[]> {
    try {
      const studentClasses = await this.studentClassRepository.find({
        where: { classId },
        relations: ['student', 'student.user', 'class'],
        order: { startDate: 'DESC' },
      });

      return studentClasses.map((studentClass) =>
        this.mapToStudentClassResponseDto(studentClass),
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération des étudiants de la classe: ${message}`,
      );
    }
  }

  async updateStudentClass(
    id: string,
    updateStudentClassDto: UpdateStudentClassDto,
  ): Promise<StudentClassResponseDto> {
    try {
      // Vérifier que l'inscription existe
      await this.getStudentClassById(id);

      // Si l'étudiant est modifié, vérifier qu'il existe
      if (updateStudentClassDto.studentId) {
        const student = await this.studentRepository.findOne({
          where: { id: updateStudentClassDto.studentId },
        });

        if (!student) {
          throw new NotFoundException('Étudiant non trouvé');
        }
      }

      // Si la classe est modifiée, vérifier qu'elle existe
      if (updateStudentClassDto.classId) {
        const classEntity = await this.classRepository.findOne({
          where: { id: updateStudentClassDto.classId },
        });

        if (!classEntity) {
          throw new NotFoundException('Classe non trouvée');
        }
      }

      // Vérifier si la nouvelle association existe déjà
      if (updateStudentClassDto.studentId || updateStudentClassDto.classId) {
        const currentStudentClass = await this.studentClassRepository.findOne({
          where: { id },
        });

        const newStudentId =
          updateStudentClassDto.studentId || currentStudentClass?.studentId;
        const newClassId =
          updateStudentClassDto.classId || currentStudentClass?.classId;

        const existingStudentClass = await this.studentClassRepository.findOne({
          where: {
            studentId: newStudentId,
            classId: newClassId,
          },
        });

        if (existingStudentClass && existingStudentClass.id !== id) {
          throw new ConflictException(
            'Cet étudiant est déjà inscrit dans cette classe',
          );
        }
      }

      await this.studentClassRepository.update(id, updateStudentClassDto);

      const updatedStudentClass = await this.studentClassRepository.findOne({
        where: { id },
        relations: ['student', 'student.user', 'class'],
      });

      if (!updatedStudentClass) {
        throw new NotFoundException(
          'Inscription non trouvée après mise à jour',
        );
      }

      return this.mapToStudentClassResponseDto(updatedStudentClass);
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
        `Erreur lors de la mise à jour de l'inscription: ${message}`,
      );
    }
  }

  async deleteStudentClass(id: string): Promise<{ message: string }> {
    try {
      // Vérifier que l'inscription existe
      await this.getStudentClassById(id);

      await this.studentClassRepository.delete(id);

      return { message: 'Inscription supprimée avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la suppression de l'inscription: ${message}`,
      );
    }
  }

  private mapToStudentClassResponseDto(
    studentClass: StudentClass,
  ): StudentClassResponseDto {
    return {
      id: studentClass.id,
      studentId: studentClass.studentId,
      classId: studentClass.classId,
      startDate: studentClass.startDate,
      endDate: studentClass.endDate,
      year: studentClass.year,
      createdAt: studentClass.createdAt,
      updatedAt: studentClass.updatedAt,
      student: {
        id: studentClass.student.id,
        matricule: studentClass.student.matricule,
        userId: studentClass.student.userId,
        enrollmentDate: studentClass.student.enrollmentDate,
        createdAt: studentClass.student.createdAt,
        updatedAt: studentClass.student.updatedAt,
        photo: studentClass.student.photo,
        maritalStatus: studentClass.student.maritalStatus,
        fatherName: studentClass.student.fatherName,
        motherName: studentClass.student.motherName,
        tutorName: studentClass.student.tutorName,
        tutorPhone: studentClass.student.tutorPhone,
        address: studentClass.student.address,
        emergencyContact: studentClass.student.emergencyContact,
        notes: studentClass.student.notes,
        user: {
          id: studentClass.student.user.id,
          username: studentClass.student.user.username,
          firstName: studentClass.student.user.firstName,
          lastName: studentClass.student.user.lastName,
          gender: studentClass.student.user.gender,
          birthDate: studentClass.student.user.birthDate,
          email: studentClass.student.user.email,
          role: studentClass.student.user.role,
          isActive: studentClass.student.user.isActive,
          phone: studentClass.student.user.phone,
          createdAt: studentClass.student.user.createdAt,
          updatedAt: studentClass.student.user.updatedAt,
        },
      },
      class: {
        id: studentClass.class.id,
        name: studentClass.class.name,
        code: studentClass.class.code,
        description: studentClass.class.description,
        level: studentClass.class.level,
        capacity: studentClass.class.capacity,
        orderLevel: studentClass.class.orderLevel,
        createdAt: studentClass.class.createdAt,
        updatedAt: studentClass.class.updatedAt,
        classCategory: studentClass.class.classCategory
          ? {
              id: studentClass.class.classCategory.id,
              name: studentClass.class.classCategory.name,
              institutionId: studentClass.class.classCategory.institutionId,
              institution: studentClass.class.classCategory.institution
                ? {
                    id: studentClass.class.classCategory.institution.id,
                    name: studentClass.class.classCategory.institution.name,
                    code: studentClass.class.classCategory.institution.code,
                    description:
                      studentClass.class.classCategory.institution.description,
                  }
                : undefined,
              createdAt: studentClass.class.classCategory.createdAt,
              updatedAt: studentClass.class.classCategory.updatedAt,
            }
          : null,
        classSubjects: studentClass.class.classSubjects,
        studentClasses: studentClass.class.studentClasses,
      },
    };
  }
}
