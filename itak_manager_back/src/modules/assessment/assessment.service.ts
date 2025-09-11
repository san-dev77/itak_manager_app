import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assessment } from '../../entities/assessment.entity';
import { Term } from '../../entities/term.entity';
import { ClassSubject } from '../../entities/class-subject.entity';
import {
  CreateAssessmentDto,
  UpdateAssessmentDto,
  AssessmentResponseDto,
} from './dto/assessment.dto';

@Injectable()
export class AssessmentService {
  constructor(
    @InjectRepository(Assessment)
    private readonly assessmentRepository: Repository<Assessment>,
    @InjectRepository(Term)
    private readonly termRepository: Repository<Term>,
    @InjectRepository(ClassSubject)
    private readonly classSubjectRepository: Repository<ClassSubject>,
  ) {}

  async create(
    createAssessmentDto: CreateAssessmentDto,
  ): Promise<AssessmentResponseDto> {
    const { termId, classSubjectId, startDate, endDate, ...assessmentData } =
      createAssessmentDto;

    // Verify term exists and is active
    const term = await this.termRepository.findOne({
      where: { id: termId },
      relations: ['schoolYear'],
    });

    if (!term) {
      throw new NotFoundException(`Trimestre avec l'ID ${termId} non trouvé`);
    }

    if (!term.isActive) {
      throw new BadRequestException(
        'Le trimestre doit être actif pour créer une évaluation',
      );
    }

    // Verify class subject exists
    const classSubject = await this.classSubjectRepository.findOne({
      where: { id: classSubjectId },
      relations: ['class', 'subject'],
    });

    if (!classSubject) {
      throw new NotFoundException(
        `Matière de classe avec l'ID ${classSubjectId} non trouvée`,
      );
    }

    // Validate assessment dates are within term period
    const assessmentStartDate = new Date(startDate);
    const assessmentEndDate = new Date(endDate);
    const termStartDate = new Date(term.startDate);
    const termEndDate = new Date(term.endDate);

    // Validate that start date is before end date
    if (assessmentStartDate >= assessmentEndDate) {
      throw new BadRequestException(
        'La date de début doit être antérieure à la date de fin',
      );
    }

    // Validate that assessment period is within term period
    if (
      assessmentStartDate < termStartDate ||
      assessmentEndDate > termEndDate
    ) {
      throw new BadRequestException(
        `La période d'évaluation doit être comprise entre ${term.startDate.toISOString()} et ${term.endDate.toISOString()}`,
      );
    }

    // Check for duplicate assessment (same title, same class subject, overlapping dates)
    const existingAssessment = await this.assessmentRepository.findOne({
      where: {
        title: assessmentData.title,
        classSubjectId,
        startDate: assessmentStartDate,
        endDate: assessmentEndDate,
      },
    });

    if (existingAssessment) {
      throw new ConflictException(
        'Une évaluation avec le même titre existe déjà pour cette matière à cette période',
      );
    }

    const assessment = this.assessmentRepository.create({
      ...assessmentData,
      termId,
      classSubjectId,
      startDate: assessmentStartDate,
      endDate: assessmentEndDate,
    });

    const savedAssessment = await this.assessmentRepository.save(assessment);

    // Load relations for response
    const assessmentWithRelations = await this.assessmentRepository.findOne({
      where: { id: savedAssessment.id },
      relations: [
        'term',
        'classSubject',
        'classSubject.class',
        'classSubject.subject',
      ],
    });

    if (!assessmentWithRelations) {
      throw new NotFoundException(
        'Évaluation créée mais non trouvée lors du rechargement',
      );
    }

    return this.mapToAssessmentResponseDto(assessmentWithRelations);
  }

  async findAll(): Promise<AssessmentResponseDto[]> {
    const assessments = await this.assessmentRepository.find({
      relations: [
        'term',
        'classSubject',
        'classSubject.class',
        'classSubject.subject',
      ],
      order: { startDate: 'DESC', createdAt: 'DESC' },
    });

    return assessments.map((assessment) =>
      this.mapToAssessmentResponseDto(assessment),
    );
  }

  async findOne(id: string): Promise<AssessmentResponseDto> {
    const assessment = await this.assessmentRepository.findOne({
      where: { id },
      relations: [
        'term',
        'classSubject',
        'classSubject.class',
        'classSubject.subject',
      ],
    });

    if (!assessment) {
      throw new NotFoundException(`Évaluation avec l'ID ${id} non trouvée`);
    }

    return this.mapToAssessmentResponseDto(assessment);
  }

  async findByTerm(termId: string): Promise<AssessmentResponseDto[]> {
    // Verify term exists
    const term = await this.termRepository.findOne({ where: { id: termId } });
    if (!term) {
      throw new NotFoundException(`Trimestre avec l'ID ${termId} non trouvé`);
    }

    const assessments = await this.assessmentRepository.find({
      where: { termId },
      relations: [
        'term',
        'classSubject',
        'classSubject.class',
        'classSubject.subject',
      ],
      order: { startDate: 'ASC', createdAt: 'ASC' },
    });

    return assessments.map((assessment) =>
      this.mapToAssessmentResponseDto(assessment),
    );
  }

  async findByClassSubject(
    classSubjectId: string,
  ): Promise<AssessmentResponseDto[]> {
    // Verify class subject exists
    const classSubject = await this.classSubjectRepository.findOne({
      where: { id: classSubjectId },
    });
    if (!classSubject) {
      throw new NotFoundException(
        `Matière de classe avec l'ID ${classSubjectId} non trouvée`,
      );
    }

    const assessments = await this.assessmentRepository.find({
      where: { classSubjectId },
      relations: [
        'term',
        'classSubject',
        'classSubject.class',
        'classSubject.subject',
      ],
      order: { startDate: 'DESC', createdAt: 'DESC' },
    });

    return assessments.map((assessment) =>
      this.mapToAssessmentResponseDto(assessment),
    );
  }

  async findByClass(classId: string): Promise<AssessmentResponseDto[]> {
    const assessments = await this.assessmentRepository
      .createQueryBuilder('assessment')
      .leftJoinAndSelect('assessment.term', 'term')
      .leftJoinAndSelect('assessment.classSubject', 'classSubject')
      .leftJoinAndSelect('classSubject.class', 'class')
      .leftJoinAndSelect('classSubject.subject', 'subject')
      .where('class.id = :classId', { classId })
      .orderBy('assessment.date', 'DESC')
      .addOrderBy('assessment.createdAt', 'DESC')
      .getMany();

    return assessments.map((assessment) =>
      this.mapToAssessmentResponseDto(assessment),
    );
  }

  async update(
    id: string,
    updateAssessmentDto: UpdateAssessmentDto,
  ): Promise<AssessmentResponseDto> {
    const assessment = await this.assessmentRepository.findOne({
      where: { id },
      relations: ['term', 'classSubject'],
    });

    if (!assessment) {
      throw new NotFoundException(`Évaluation avec l'ID ${id} non trouvée`);
    }

    // If date is being updated, validate it's within term period
    if (updateAssessmentDto.startDate || updateAssessmentDto.endDate) {
      const newDate = new Date(updateAssessmentDto.startDate!);
      const termStartDate = new Date(assessment.term.startDate);
      const termEndDate = new Date(assessment.term.endDate);

      if (newDate < termStartDate || newDate > termEndDate) {
        throw new BadRequestException(
          `La date de l'évaluation doit être comprise entre ${assessment.term.startDate.toISOString()} et ${assessment.term.endDate.toISOString()}`,
        );
      }
    }

    // Check for duplicate if title or date is being updated
    if (
      updateAssessmentDto.title ||
      updateAssessmentDto.startDate ||
      updateAssessmentDto.endDate
    ) {
      const title = updateAssessmentDto.title || assessment.title;
      const startDate = updateAssessmentDto.startDate
        ? new Date(updateAssessmentDto.startDate)
        : assessment.startDate;
      const endDate = updateAssessmentDto.endDate
        ? new Date(updateAssessmentDto.endDate)
        : assessment.endDate;

      const existingAssessment = await this.assessmentRepository.findOne({
        where: {
          title,
          classSubjectId: assessment.classSubjectId,
          startDate,
          endDate,
        },
      });

      if (existingAssessment && existingAssessment.id !== id) {
        throw new ConflictException(
          'Une évaluation avec le même titre existe déjà pour cette matière à cette date',
        );
      }
    }

    // Update assessment
    Object.assign(assessment, updateAssessmentDto);
    if (updateAssessmentDto.startDate) {
      assessment.startDate = new Date(updateAssessmentDto.startDate);
    }
    if (updateAssessmentDto.endDate) {
      assessment.endDate = new Date(updateAssessmentDto.endDate);
    }

    const updatedAssessment = await this.assessmentRepository.save(assessment);
    return this.mapToAssessmentResponseDto(updatedAssessment);
  }

  async remove(id: string): Promise<void> {
    const assessment = await this.assessmentRepository.findOne({
      where: { id },
    });

    if (!assessment) {
      throw new NotFoundException(`Évaluation avec l'ID ${id} non trouvée`);
    }

    await this.assessmentRepository.remove(assessment);
  }

  private mapToAssessmentResponseDto(
    assessment: Assessment,
  ): AssessmentResponseDto {
    return {
      id: assessment.id,
      termId: assessment.termId,
      termName: assessment.term?.name || '',
      classSubjectId: assessment.classSubjectId,
      className: assessment.classSubject?.class?.name || '',
      subjectName: assessment.classSubject?.subject?.name || '',
      type: assessment.type,
      title: assessment.title,
      description: assessment.description || '',
      startDate: assessment.startDate, // Format as YYYY-MM-DD
      endDate: assessment.endDate, // Format as YYYY-MM-DD
      maxScore: assessment.maxScore,
      weight: assessment.weight,
      createdAt: assessment.createdAt,
      updatedAt: assessment.updatedAt,
    };
  }
}
