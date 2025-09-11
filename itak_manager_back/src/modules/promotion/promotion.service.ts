import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from '../../entities/class.entity';
import { Student } from '../../entities/student.entity';
import { StudentClass } from '../../entities/student-class.entity';
import { StudentPromotion } from '../../entities/student-promotion.entity';
import {
  CreatePromotionDto,
  BulkPromotionDto,
  PromotionResponseDto,
  NextClassResponseDto,
} from './dto/promotion.dto';

@Injectable()
export class PromotionService {
  constructor(
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(StudentClass)
    private studentClassRepository: Repository<StudentClass>,
    @InjectRepository(StudentPromotion)
    private studentPromotionRepository: Repository<StudentPromotion>,
  ) {}

  async getNextClass(currentClassId: string): Promise<NextClassResponseDto> {
    try {
      // Récupérer la classe actuelle
      const currentClass = await this.classRepository.findOne({
        where: { id: currentClassId },
        relations: ['classCategory'],
      });

      if (!currentClass) {
        throw new NotFoundException('Classe actuelle non trouvée');
      }

      // Trouver la classe supérieure dans la même catégorie
      const nextClass = await this.classRepository.findOne({
        where: {
          categoryId: currentClass.categoryId,
          orderLevel: currentClass.orderLevel + 1,
        },
        relations: ['classCategory'],
      });

      const canPromote = nextClass !== null;
      const message = canPromote
        ? `Promotion possible vers ${nextClass.name}`
        : 'Aucune classe supérieure disponible dans cette catégorie';

      return {
        currentClass,
        nextClass,
        canPromote,
        message,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(`Erreur lors de la recherche de la classe supérieure: ${message}`);
    }
  }

  async promoteStudent(createPromotionDto: CreatePromotionDto): Promise<PromotionResponseDto> {
    try {
      // Vérifier que l'étudiant existe
      const student = await this.studentRepository.findOne({
        where: { id: createPromotionDto.studentId },
        relations: ['user'],
      });

      if (!student) {
        throw new NotFoundException('Étudiant non trouvé');
      }

      // Récupérer la classe actuelle de l'étudiant
      const currentStudentClass = await this.studentClassRepository.findOne({
        where: { studentId: createPromotionDto.studentId },
        relations: ['class', 'class.classCategory'],
        order: { createdAt: 'DESC' },
      });

      if (!currentStudentClass) {
        throw new NotFoundException('Aucune classe actuelle trouvée pour cet étudiant');
      }

      // Vérifier que la classe de destination existe
      const toClass = await this.classRepository.findOne({
        where: { id: createPromotionDto.toClassId },
        relations: ['classCategory'],
      });

      if (!toClass) {
        throw new NotFoundException('Classe de destination non trouvée');
      }

      // Vérifier que la promotion est logique (classe supérieure)
      if (toClass.orderLevel <= currentStudentClass.class.orderLevel) {
        throw new BadRequestException(
          'La classe de destination doit avoir un niveau supérieur à la classe actuelle',
        );
      }

      // Créer l'enregistrement de promotion
      const promotion = this.studentPromotionRepository.create({
        studentId: createPromotionDto.studentId,
        fromClassId: currentStudentClass.class.id,
        toClassId: createPromotionDto.toClassId,
        year: createPromotionDto.year,
        remarks: createPromotionDto.remarks,
      });

      const savedPromotion = await this.studentPromotionRepository.save(promotion);

      // Mettre à jour la classe de l'étudiant
      await this.studentClassRepository.update(
        { studentId: createPromotionDto.studentId },
        { classId: createPromotionDto.toClassId },
      );

      return {
        student,
        fromClass: currentStudentClass.class,
        toClass,
        year: savedPromotion.year,
        remarks: savedPromotion.remarks,
        createdAt: savedPromotion.createdAt,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(`Erreur lors de la promotion de l'étudiant: ${message}`);
    }
  }

  async bulkPromoteClass(bulkPromotionDto: BulkPromotionDto): Promise<PromotionResponseDto[]> {
    try {
      // Vérifier que les classes existent
      const fromClass = await this.classRepository.findOne({
        where: { id: bulkPromotionDto.fromClassId },
        relations: ['classCategory'],
      });

      const toClass = await this.classRepository.findOne({
        where: { id: bulkPromotionDto.toClassId },
        relations: ['classCategory'],
      });

      if (!fromClass || !toClass) {
        throw new NotFoundException('Classe source ou destination non trouvée');
      }

      // Vérifier que la promotion est logique
      if (toClass.orderLevel <= fromClass.orderLevel) {
        throw new BadRequestException(
          'La classe de destination doit avoir un niveau supérieur à la classe source',
        );
      }

      // Récupérer tous les étudiants de la classe source
      const studentClasses = await this.studentClassRepository.find({
        where: { classId: bulkPromotionDto.fromClassId },
        relations: ['student', 'student.user'],
      });

      if (studentClasses.length === 0) {
        throw new NotFoundException('Aucun étudiant trouvé dans la classe source');
      }

      const promotions: PromotionResponseDto[] = [];

      // Promouvoir chaque étudiant
      for (const studentClass of studentClasses) {
        const promotionDto: CreatePromotionDto = {
          studentId: studentClass.student.id,
          toClassId: bulkPromotionDto.toClassId,
          year: bulkPromotionDto.year,
          remarks: bulkPromotionDto.remarks,
        };

        const promotion = await this.promoteStudent(promotionDto);
        promotions.push(promotion);
      }

      return promotions;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(`Erreur lors de la promotion en masse: ${message}`);
    }
  }

  async getPromotionHistory(studentId: string): Promise<PromotionResponseDto[]> {
    try {
      const promotions = await this.studentPromotionRepository.find({
        where: { studentId },
        relations: ['student', 'student.user', 'fromClass', 'toClass'],
        order: { createdAt: 'DESC' },
      });

      return promotions.map((promotion) => ({
        student: promotion.student,
        fromClass: promotion.fromClass,
        toClass: promotion.toClass,
        year: promotion.year,
        remarks: promotion.remarks,
        createdAt: promotion.createdAt,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(`Erreur lors de la récupération de l'historique: ${message}`);
    }
  }

  async getClassesByOrderLevel(categoryId: string): Promise<Class[]> {
    try {
      return await this.classRepository.find({
        where: { categoryId },
        relations: ['classCategory'],
        order: { orderLevel: 'ASC' },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(`Erreur lors de la récupération des classes: ${message}`);
    }
  }
}
