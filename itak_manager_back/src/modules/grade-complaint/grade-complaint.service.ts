import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  GradeComplaint,
  ComplaintStatus,
} from '../../entities/grade-complaint.entity';
import { GradeComplaintHistory } from '../../entities/grade-complaint-history.entity';
import { Assessment } from '../../entities/assessment.entity';
import { Student } from '../../entities/student.entity';
import { AssessmentResult } from '../../entities/assessment-result.entity';
import {
  CreateGradeComplaintDto,
  UpdateGradeComplaintStatusDto,
  GradeComplaintResponseDto,
  GradeComplaintHistoryResponseDto,
} from './dto/grade-complaint.dto';

@Injectable()
export class GradeComplaintService {
  constructor(
    @InjectRepository(GradeComplaint)
    private readonly gradeComplaintRepository: Repository<GradeComplaint>,
    @InjectRepository(GradeComplaintHistory)
    private readonly gradeComplaintHistoryRepository: Repository<GradeComplaintHistory>,
    @InjectRepository(Assessment)
    private readonly assessmentRepository: Repository<Assessment>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(AssessmentResult)
    private readonly assessmentResultRepository: Repository<AssessmentResult>,
  ) {}

  async create(
    createGradeComplaintDto: CreateGradeComplaintDto,
  ): Promise<GradeComplaintResponseDto> {
    const { studentId, assessmentId, reason } = createGradeComplaintDto;

    // Verify student exists
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
      relations: ['user'],
    });

    if (!student) {
      throw new NotFoundException(`Étudiant avec l'ID ${studentId} non trouvé`);
    }

    // Verify assessment exists
    const assessment = await this.assessmentRepository.findOne({
      where: { id: assessmentId },
    });

    if (!assessment) {
      throw new NotFoundException(
        `Évaluation avec l'ID ${assessmentId} non trouvée`,
      );
    }

    // Verify assessment result exists for this student
    const assessmentResult = await this.assessmentResultRepository.findOne({
      where: { studentId, assessmentId },
    });

    if (!assessmentResult) {
      throw new BadRequestException(
        'Aucun résultat trouvé pour cet étudiant et cette évaluation',
      );
    }

    // Check for existing complaint
    const existingComplaint = await this.gradeComplaintRepository.findOne({
      where: { studentId, assessmentId },
    });

    if (existingComplaint) {
      throw new ConflictException(
        'Une réclamation existe déjà pour cet étudiant et cette évaluation',
      );
    }

    const gradeComplaint = this.gradeComplaintRepository.create({
      studentId,
      assessmentId,
      reason,
      status: ComplaintStatus.PENDING,
    });

    const savedComplaint =
      await this.gradeComplaintRepository.save(gradeComplaint);

    // Load relations for response
    const complaintWithRelations = await this.gradeComplaintRepository.findOne({
      where: { id: savedComplaint.id },
      relations: ['student', 'student.user', 'assessment'],
    });

    if (!complaintWithRelations) {
      throw new NotFoundException(
        'Réclamation créée mais non trouvée lors du rechargement',
      );
    }

    return this.mapToGradeComplaintResponseDto(
      complaintWithRelations,
      assessmentResult.score,
    );
  }

  async findAll(): Promise<GradeComplaintResponseDto[]> {
    const complaints = await this.gradeComplaintRepository.find({
      relations: ['student', 'student.user', 'assessment'],
      order: { createdAt: 'DESC' },
    });

    const complaintsWithScores = await Promise.all(
      complaints.map(async (complaint) => {
        const result = await this.assessmentResultRepository.findOne({
          where: {
            studentId: complaint.studentId,
            assessmentId: complaint.assessmentId,
          },
        });
        return this.mapToGradeComplaintResponseDto(
          complaint,
          result?.score || 0,
        );
      }),
    );

    return complaintsWithScores;
  }

  async findOne(id: string): Promise<GradeComplaintResponseDto> {
    const complaint = await this.gradeComplaintRepository.findOne({
      where: { id },
      relations: ['student', 'student.user', 'assessment'],
    });

    if (!complaint) {
      throw new NotFoundException(`Réclamation avec l'ID ${id} non trouvée`);
    }

    const result = await this.assessmentResultRepository.findOne({
      where: {
        studentId: complaint.studentId,
        assessmentId: complaint.assessmentId,
      },
    });

    return this.mapToGradeComplaintResponseDto(complaint, result?.score || 0);
  }

  async findByStudent(studentId: string): Promise<GradeComplaintResponseDto[]> {
    // Verify student exists
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });
    if (!student) {
      throw new NotFoundException(`Étudiant avec l'ID ${studentId} non trouvé`);
    }

    const complaints = await this.gradeComplaintRepository.find({
      where: { studentId },
      relations: ['student', 'student.user', 'assessment'],
      order: { createdAt: 'DESC' },
    });

    const complaintsWithScores = await Promise.all(
      complaints.map(async (complaint) => {
        const result = await this.assessmentResultRepository.findOne({
          where: {
            studentId: complaint.studentId,
            assessmentId: complaint.assessmentId,
          },
        });
        return this.mapToGradeComplaintResponseDto(
          complaint,
          result?.score || 0,
        );
      }),
    );

    return complaintsWithScores;
  }

  async findByAssessment(
    assessmentId: string,
  ): Promise<GradeComplaintResponseDto[]> {
    // Verify assessment exists
    const assessment = await this.assessmentRepository.findOne({
      where: { id: assessmentId },
    });
    if (!assessment) {
      throw new NotFoundException(
        `Évaluation avec l'ID ${assessmentId} non trouvée`,
      );
    }

    const complaints = await this.gradeComplaintRepository.find({
      where: { assessmentId },
      relations: ['student', 'student.user', 'assessment'],
      order: { createdAt: 'DESC' },
    });

    const complaintsWithScores = await Promise.all(
      complaints.map(async (complaint) => {
        const result = await this.assessmentResultRepository.findOne({
          where: {
            studentId: complaint.studentId,
            assessmentId: complaint.assessmentId,
          },
        });
        return this.mapToGradeComplaintResponseDto(
          complaint,
          result?.score || 0,
        );
      }),
    );

    return complaintsWithScores;
  }

  async updateStatus(
    id: string,
    updateStatusDto: UpdateGradeComplaintStatusDto,
    changedByUserId: string,
  ): Promise<GradeComplaintResponseDto> {
    const complaint = await this.gradeComplaintRepository.findOne({
      where: { id },
      relations: ['assessment'],
    });

    if (!complaint) {
      throw new NotFoundException(`Réclamation avec l'ID ${id} non trouvée`);
    }

    // Prevent status change if already processed
    if (
      complaint.status === ComplaintStatus.APPROVED ||
      complaint.status === ComplaintStatus.REJECTED
    ) {
      throw new BadRequestException(
        'Cette réclamation a déjà été traitée et ne peut plus être modifiée',
      );
    }

    const { status, comment, newScore } = updateStatusDto;

    // If approving, validate and update the score
    if (status === ComplaintStatus.APPROVED) {
      if (newScore === undefined) {
        throw new BadRequestException(
          "Une nouvelle note doit être fournie lors de l'approbation",
        );
      }

      if (newScore > complaint.assessment.maxScore) {
        throw new BadRequestException(
          `La nouvelle note (${newScore}) ne peut pas dépasser la note maximale de l'évaluation (${complaint.assessment.maxScore})`,
        );
      }

      // Get current assessment result
      const currentResult = await this.assessmentResultRepository.findOne({
        where: {
          studentId: complaint.studentId,
          assessmentId: complaint.assessmentId,
        },
      });

      if (!currentResult) {
        throw new NotFoundException(
          "Résultat d'évaluation non trouvé pour cette réclamation",
        );
      }

      const oldScore = currentResult.score;

      // Update the assessment result
      currentResult.score = newScore;
      await this.assessmentResultRepository.save(currentResult);

      // Create history entry
      const historyEntry = this.gradeComplaintHistoryRepository.create({
        complaintId: id,
        oldScore,
        newScore,
        changedBy: changedByUserId,
        comment: comment || 'Réclamation approuvée',
      });

      await this.gradeComplaintHistoryRepository.save(historyEntry);
    }

    // Update complaint status
    complaint.status = status;
    const updatedComplaint =
      await this.gradeComplaintRepository.save(complaint);

    // Load relations for response
    const complaintWithRelations = await this.gradeComplaintRepository.findOne({
      where: { id: updatedComplaint.id },
      relations: ['student', 'student.user', 'assessment'],
    });

    if (!complaintWithRelations) {
      throw new NotFoundException(
        'Réclamation mise à jour mais non trouvée lors du rechargement',
      );
    }

    const result = await this.assessmentResultRepository.findOne({
      where: {
        studentId: complaintWithRelations.studentId,
        assessmentId: complaintWithRelations.assessmentId,
      },
    });

    return this.mapToGradeComplaintResponseDto(
      complaintWithRelations,
      result?.score || 0,
    );
  }

  async getHistory(id: string): Promise<GradeComplaintHistoryResponseDto[]> {
    // Verify complaint exists
    const complaint = await this.gradeComplaintRepository.findOne({
      where: { id },
    });
    if (!complaint) {
      throw new NotFoundException(`Réclamation avec l'ID ${id} non trouvée`);
    }

    const history = await this.gradeComplaintHistoryRepository.find({
      where: { complaintId: id },
      relations: ['changedByUser'],
      order: { changedAt: 'DESC' },
    });

    return history.map((entry) => ({
      id: entry.id,
      complaintId: entry.complaintId,
      oldScore: entry.oldScore,
      newScore: entry.newScore,
      changedBy: entry.changedBy,
      changedByName: entry.changedByUser
        ? `${entry.changedByUser.firstName} ${entry.changedByUser.lastName}`
        : '',
      changedAt: entry.changedAt,
      comment: entry.comment || '',
    }));
  }

  async remove(id: string): Promise<void> {
    const complaint = await this.gradeComplaintRepository.findOne({
      where: { id },
    });

    if (!complaint) {
      throw new NotFoundException(`Réclamation avec l'ID ${id} non trouvée`);
    }

    // Prevent deletion if already processed
    if (
      complaint.status === ComplaintStatus.APPROVED ||
      complaint.status === ComplaintStatus.REJECTED
    ) {
      throw new ForbiddenException(
        'Les réclamations traitées ne peuvent pas être supprimées',
      );
    }

    await this.gradeComplaintRepository.remove(complaint);
  }

  private mapToGradeComplaintResponseDto(
    complaint: GradeComplaint,
    currentScore: number,
  ): GradeComplaintResponseDto {
    return {
      id: complaint.id,
      studentId: complaint.studentId,
      studentName: complaint.student?.user
        ? `${complaint.student.user.firstName} ${complaint.student.user.lastName}`
        : '',
      studentMatricule: complaint.student?.matricule || '',
      assessmentId: complaint.assessmentId,
      assessmentTitle: complaint.assessment?.title || '',
      currentScore,
      maxScore: complaint.assessment?.maxScore || 0,
      status: complaint.status,
      reason: complaint.reason,
      createdAt: complaint.createdAt,
      updatedAt: complaint.updatedAt,
    };
  }
}
