import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssessmentResult } from '../../entities/assessment-result.entity';
import { Assessment } from '../../entities/assessment.entity';
import { Student } from '../../entities/student.entity';
import {
  CreateAssessmentResultDto,
  UpdateAssessmentResultDto,
  AssessmentResultResponseDto,
  BulkCreateAssessmentResultDto,
} from './dto/assessment-result.dto';

@Injectable()
export class AssessmentResultService {
  constructor(
    @InjectRepository(AssessmentResult)
    private readonly assessmentResultRepository: Repository<AssessmentResult>,
    @InjectRepository(Assessment)
    private readonly assessmentRepository: Repository<Assessment>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async create(
    createAssessmentResultDto: CreateAssessmentResultDto,
  ): Promise<AssessmentResultResponseDto> {
    const { assessmentId, studentId, score, ...resultData } =
      createAssessmentResultDto;

    // Verify assessment exists
    const assessment = await this.assessmentRepository.findOne({
      where: { id: assessmentId },
    });

    if (!assessment) {
      throw new NotFoundException(
        `Évaluation avec l'ID ${assessmentId} non trouvée`,
      );
    }

    // Verify student exists
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
      relations: ['user'],
    });

    if (!student) {
      throw new NotFoundException(`Étudiant avec l'ID ${studentId} non trouvé`);
    }

    // Validate score against assessment max score
    if (score > assessment.maxScore) {
      throw new BadRequestException(
        `La note (${score}) ne peut pas dépasser la note maximale de l'évaluation (${assessment.maxScore})`,
      );
    }

    // Check for existing result
    const existingResult = await this.assessmentResultRepository.findOne({
      where: { assessmentId, studentId },
    });

    if (existingResult) {
      throw new ConflictException(
        'Un résultat existe déjà pour cet étudiant et cette évaluation',
      );
    }

    const assessmentResult = this.assessmentResultRepository.create({
      ...resultData,
      assessmentId,
      studentId,
      score,
    });

    const savedResult =
      await this.assessmentResultRepository.save(assessmentResult);

    // Load relations for response
    const resultWithRelations = await this.assessmentResultRepository.findOne({
      where: { id: savedResult.id },
      relations: ['assessment', 'student', 'student.user'],
    });

    if (!resultWithRelations) {
      throw new NotFoundException(
        'Résultat créé mais non trouvé lors du rechargement',
      );
    }

    return this.mapToAssessmentResultResponseDto(resultWithRelations);
  }

  async bulkCreate(
    bulkCreateDto: BulkCreateAssessmentResultDto,
  ): Promise<AssessmentResultResponseDto[]> {
    const { assessmentId, results } = bulkCreateDto;

    // Verify assessment exists
    const assessment = await this.assessmentRepository.findOne({
      where: { id: assessmentId },
    });

    if (!assessment) {
      throw new NotFoundException(
        `Évaluation avec l'ID ${assessmentId} non trouvée`,
      );
    }

    const createdResults: AssessmentResultResponseDto[] = [];

    for (const resultData of results) {
      try {
        const result = await this.create({
          ...resultData,
          assessmentId,
        });
        createdResults.push(result);
      } catch (error) {
        // Continue with other results even if one fails
        console.error(
          `Erreur lors de la création du résultat pour l'étudiant ${resultData.studentId}:`,
          error,
        );
      }
    }

    return createdResults;
  }

  async findAll(): Promise<AssessmentResultResponseDto[]> {
    const results = await this.assessmentResultRepository.find({
      relations: ['assessment', 'student', 'student.user'],
      order: { createdAt: 'DESC' },
    });

    return results.map((result) =>
      this.mapToAssessmentResultResponseDto(result),
    );
  }

  async findOne(id: string): Promise<AssessmentResultResponseDto> {
    const result = await this.assessmentResultRepository.findOne({
      where: { id },
      relations: ['assessment', 'student', 'student.user'],
    });

    if (!result) {
      throw new NotFoundException(`Résultat avec l'ID ${id} non trouvé`);
    }

    return this.mapToAssessmentResultResponseDto(result);
  }

  async findByAssessment(
    assessmentId: string,
  ): Promise<AssessmentResultResponseDto[]> {
    // Verify assessment exists
    const assessment = await this.assessmentRepository.findOne({
      where: { id: assessmentId },
    });
    if (!assessment) {
      throw new NotFoundException(
        `Évaluation avec l'ID ${assessmentId} non trouvée`,
      );
    }

    const results = await this.assessmentResultRepository.find({
      where: { assessmentId },
      relations: ['assessment', 'student', 'student.user'],
      order: { score: 'DESC' },
    });

    return results.map((result) =>
      this.mapToAssessmentResultResponseDto(result),
    );
  }

  async findByStudent(
    studentId: string,
  ): Promise<AssessmentResultResponseDto[]> {
    // Verify student exists
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });
    if (!student) {
      throw new NotFoundException(`Étudiant avec l'ID ${studentId} non trouvé`);
    }

    const results = await this.assessmentResultRepository.find({
      where: { studentId },
      relations: ['assessment', 'student', 'student.user'],
      order: { createdAt: 'DESC' },
    });

    return results.map((result) =>
      this.mapToAssessmentResultResponseDto(result),
    );
  }

  async update(
    id: string,
    updateAssessmentResultDto: UpdateAssessmentResultDto,
  ): Promise<AssessmentResultResponseDto> {
    const result = await this.assessmentResultRepository.findOne({
      where: { id },
      relations: ['assessment'],
    });

    if (!result) {
      throw new NotFoundException(`Résultat avec l'ID ${id} non trouvé`);
    }

    // Validate score if being updated
    if (updateAssessmentResultDto.score !== undefined) {
      if (updateAssessmentResultDto.score > result.assessment.maxScore) {
        throw new BadRequestException(
          `La note (${updateAssessmentResultDto.score}) ne peut pas dépasser la note maximale de l'évaluation (${result.assessment.maxScore})`,
        );
      }
    }

    // Update result
    Object.assign(result, updateAssessmentResultDto);
    const updatedResult = await this.assessmentResultRepository.save(result);

    // Load relations for response
    const resultWithRelations = await this.assessmentResultRepository.findOne({
      where: { id: updatedResult.id },
      relations: ['assessment', 'student', 'student.user'],
    });

    if (!resultWithRelations) {
      throw new NotFoundException(
        'Résultat mis à jour mais non trouvé lors du rechargement',
      );
    }

    return this.mapToAssessmentResultResponseDto(resultWithRelations);
  }

  async remove(id: string): Promise<void> {
    const result = await this.assessmentResultRepository.findOne({
      where: { id },
    });

    if (!result) {
      throw new NotFoundException(`Résultat avec l'ID ${id} non trouvé`);
    }

    await this.assessmentResultRepository.remove(result);
  }

  private mapToAssessmentResultResponseDto(
    result: AssessmentResult,
  ): AssessmentResultResponseDto {
    const percentage = (result.score / result.assessment.maxScore) * 100;

    return {
      id: result.id,
      assessmentId: result.assessmentId,
      assessmentTitle: result.assessment?.title || '',
      assessmentMaxScore: result.assessment?.maxScore || 0,
      studentId: result.studentId,
      studentName: result.student?.user
        ? `${result.student.user.firstName} ${result.student.user.lastName}`
        : '',
      studentMatricule: result.student?.matricule || '',
      score: result.score,
      percentage: Math.round(percentage * 100) / 100, // Round to 2 decimal places
      remarks: result.remarks || '',
      status: result.status,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }
}
