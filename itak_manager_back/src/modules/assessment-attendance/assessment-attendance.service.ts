import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AssessmentAttendance,
  AttendanceStatus,
} from '../../entities/assessment-attendance.entity';
import { Assessment } from '../../entities/assessment.entity';
import { Student } from '../../entities/student.entity';
import { CreateAssessmentAttendanceDto } from './dto/create-assessment-attendance.dto';
import { UpdateAssessmentAttendanceDto } from './dto/update-assessment-attendance.dto';
import { AssessmentAttendanceResponseDto } from './dto/assessment-attendance-response.dto';
import { BulkCreateAttendanceDto } from './dto/bulk-create-attendance.dto';

@Injectable()
export class AssessmentAttendanceService {
  constructor(
    @InjectRepository(AssessmentAttendance)
    private readonly attendanceRepository: Repository<AssessmentAttendance>,
    @InjectRepository(Assessment)
    private readonly assessmentRepository: Repository<Assessment>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async create(
    createDto: CreateAssessmentAttendanceDto,
  ): Promise<AssessmentAttendanceResponseDto> {
    // Validate assessment exists
    const assessment = await this.assessmentRepository.findOne({
      where: { id: createDto.assessmentId },
    });
    if (!assessment) {
      throw new NotFoundException(
        `Assessment with ID ${createDto.assessmentId} not found`,
      );
    }

    // Validate student exists
    const student = await this.studentRepository.findOne({
      where: { id: createDto.studentId },
    });
    if (!student) {
      throw new NotFoundException(
        `Student with ID ${createDto.studentId} not found`,
      );
    }

    // Check if attendance record already exists
    const existingAttendance = await this.attendanceRepository.findOne({
      where: {
        assessmentId: createDto.assessmentId,
        studentId: createDto.studentId,
      },
    });

    if (existingAttendance) {
      throw new ConflictException(
        `Attendance record already exists for student ${createDto.studentId} in assessment ${createDto.assessmentId}`,
      );
    }

    // Create attendance record
    const attendance = this.attendanceRepository.create({
      ...createDto,
      markedAt: createDto.markedBy ? new Date() : undefined,
    });

    const savedAttendance = await this.attendanceRepository.save(attendance);
    return this.mapToResponseDto(savedAttendance);
  }

  async bulkCreate(
    bulkDto: BulkCreateAttendanceDto,
  ): Promise<AssessmentAttendanceResponseDto[]> {
    // Validate assessment exists
    const assessment = await this.assessmentRepository.findOne({
      where: { id: bulkDto.assessmentId },
    });
    if (!assessment) {
      throw new NotFoundException(
        `Assessment with ID ${bulkDto.assessmentId} not found`,
      );
    }

    // Validate all students exist
    const studentIds = bulkDto.attendances.map((att) => att.studentId);
    const students = await this.studentRepository.findByIds(studentIds);

    if (students.length !== studentIds.length) {
      const foundIds = students.map((s) => s.id);
      const missingIds = studentIds.filter((id) => !foundIds.includes(id));
      throw new NotFoundException(
        `Students not found: ${missingIds.join(', ')}`,
      );
    }

    // Check for existing attendance records
    const existingAttendances = await this.attendanceRepository.find({
      where: {
        assessmentId: bulkDto.assessmentId,
      },
    });

    const existingStudentIds = existingAttendances.map((att) => att.studentId);
    const duplicateIds = studentIds.filter((id) =>
      existingStudentIds.includes(id),
    );

    if (duplicateIds.length > 0) {
      throw new ConflictException(
        `Attendance records already exist for students: ${duplicateIds.join(', ')}`,
      );
    }

    // Create attendance records
    const attendanceRecords = bulkDto.attendances.map((attDto) =>
      this.attendanceRepository.create({
        assessmentId: bulkDto.assessmentId,
        studentId: attDto.studentId,
        status: attDto.status,
        reason: attDto.reason,
        markedBy: bulkDto.markedBy,
        markedAt: bulkDto.markedBy ? new Date() : undefined,
      }),
    );

    const savedAttendances =
      await this.attendanceRepository.save(attendanceRecords);
    return savedAttendances.map((attendance) =>
      this.mapToResponseDto(attendance),
    );
  }

  async findAll(filters?: {
    assessmentId?: string;
    studentId?: string;
    status?: AttendanceStatus;
  }): Promise<AssessmentAttendanceResponseDto[]> {
    const queryBuilder = this.attendanceRepository
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.assessment', 'assessment')
      .leftJoinAndSelect('attendance.student', 'student')
      .leftJoinAndSelect('student.user', 'user')
      .orderBy('attendance.createdAt', 'DESC');

    if (filters?.assessmentId) {
      queryBuilder.andWhere('attendance.assessmentId = :assessmentId', {
        assessmentId: filters.assessmentId,
      });
    }

    if (filters?.studentId) {
      queryBuilder.andWhere('attendance.studentId = :studentId', {
        studentId: filters.studentId,
      });
    }

    if (filters?.status) {
      queryBuilder.andWhere('attendance.status = :status', {
        status: filters.status,
      });
    }

    const attendances = await queryBuilder.getMany();
    return attendances.map((attendance) => this.mapToResponseDto(attendance));
  }

  async findByAssessment(
    assessmentId: string,
  ): Promise<AssessmentAttendanceResponseDto[]> {
    return this.findAll({ assessmentId });
  }

  async findByStudent(
    studentId: string,
  ): Promise<AssessmentAttendanceResponseDto[]> {
    return this.findAll({ studentId });
  }

  async findOne(
    assessmentId: string,
    studentId: string,
  ): Promise<AssessmentAttendanceResponseDto> {
    const attendance = await this.attendanceRepository.findOne({
      where: { assessmentId, studentId },
      relations: ['assessment', 'student', 'student.user'],
    });

    if (!attendance) {
      throw new NotFoundException(
        `Attendance record not found for student ${studentId} in assessment ${assessmentId}`,
      );
    }

    return this.mapToResponseDto(attendance);
  }

  async update(
    assessmentId: string,
    studentId: string,
    updateDto: UpdateAssessmentAttendanceDto,
  ): Promise<AssessmentAttendanceResponseDto> {
    const attendance = await this.attendanceRepository.findOne({
      where: { assessmentId, studentId },
    });

    if (!attendance) {
      throw new NotFoundException(
        `Attendance record not found for student ${studentId} in assessment ${assessmentId}`,
      );
    }

    // Update marked information if status is being changed
    if (updateDto.status && updateDto.status !== attendance.status) {
      updateDto.markedBy = updateDto.markedBy || attendance.markedBy;
      attendance.markedAt = new Date();
    }

    await this.attendanceRepository.update(
      { assessmentId, studentId },
      { ...updateDto, markedAt: attendance.markedAt },
    );

    const updatedAttendance = await this.attendanceRepository.findOne({
      where: { assessmentId, studentId },
      relations: ['assessment', 'student', 'student.user'],
    });

    return this.mapToResponseDto(updatedAttendance!);
  }

  async remove(assessmentId: string, studentId: string): Promise<void> {
    const attendance = await this.attendanceRepository.findOne({
      where: { assessmentId, studentId },
    });

    if (!attendance) {
      throw new NotFoundException(
        `Attendance record not found for student ${studentId} in assessment ${assessmentId}`,
      );
    }

    await this.attendanceRepository.remove(attendance);
  }

  async getAttendanceStats(assessmentId: string): Promise<{
    total: number;
    present: number;
    absent: number;
    excused: number;
    excluded: number;
    percentages: {
      present: number;
      absent: number;
      excused: number;
      excluded: number;
    };
  }> {
    const attendances = await this.attendanceRepository.find({
      where: { assessmentId },
    });

    const total = attendances.length;
    const present = attendances.filter(
      (att) => att.status === AttendanceStatus.PRESENT,
    ).length;
    const absent = attendances.filter(
      (att) => att.status === AttendanceStatus.ABSENT,
    ).length;
    const excused = attendances.filter(
      (att) => att.status === AttendanceStatus.EXCUSED,
    ).length;
    const excluded = attendances.filter(
      (att) => att.status === AttendanceStatus.EXCLUDED,
    ).length;

    return {
      total,
      present,
      absent,
      excused,
      excluded,
      percentages: {
        present: total > 0 ? Math.round((present / total) * 100) : 0,
        absent: total > 0 ? Math.round((absent / total) * 100) : 0,
        excused: total > 0 ? Math.round((excused / total) * 100) : 0,
        excluded: total > 0 ? Math.round((excluded / total) * 100) : 0,
      },
    };
  }

  private mapToResponseDto(
    attendance: AssessmentAttendance,
  ): AssessmentAttendanceResponseDto {
    return {
      assessmentId: attendance.assessmentId,
      studentId: attendance.studentId,
      status: attendance.status,
      reason: attendance.reason,
      markedBy: attendance.markedBy,
      markedAt: attendance.markedAt,
      createdAt: attendance.createdAt,
      updatedAt: attendance.updatedAt,
      assessment: attendance.assessment
        ? {
            id: attendance.assessment.id,
            title: attendance.assessment.title,
            type: attendance.assessment.type,
            startDate: attendance.assessment.startDate,
            endDate: attendance.assessment.endDate,
          }
        : undefined,
      student: attendance.student
        ? {
            id: attendance.student.id,
            matricule: attendance.student.matricule,
            firstName: attendance.student.user?.firstName || '',
            lastName: attendance.student.user?.lastName || '',
          }
        : undefined,
    };
  }
}
