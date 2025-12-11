import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  StudentTransfer,
  TransferReason,
} from '../../entities/student-transfer.entity';
import {
  StudentClass,
  StudentClassStatus,
} from '../../entities/student-class.entity';
import { Student } from '../../entities/student.entity';
import { Class } from '../../entities/class.entity';
import { CreateStudentTransferDto } from './dto/create-student-transfer.dto';
import { UpdateStudentTransferDto } from './dto/update-student-transfer.dto';
import { StudentTransferResponseDto } from './dto/student-transfer-response.dto';
import { UpdateStudentClassStatusDto } from './dto/update-student-class-status.dto';

@Injectable()
export class StudentTransferService {
  constructor(
    @InjectRepository(StudentTransfer)
    private readonly studentTransferRepository: Repository<StudentTransfer>,
    @InjectRepository(StudentClass)
    private readonly studentClassRepository: Repository<StudentClass>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}

  async create(
    createDto: CreateStudentTransferDto,
  ): Promise<StudentTransferResponseDto> {
    // Validate student exists
    const student = await this.studentRepository.findOne({
      where: { id: createDto.studentId },
    });
    if (!student) {
      throw new NotFoundException(
        `Student with ID ${createDto.studentId} not found`,
      );
    }

    // Validate classes exist
    const [fromClass, toClass] = await Promise.all([
      this.classRepository.findOne({ where: { id: createDto.fromClassId } }),
      this.classRepository.findOne({ where: { id: createDto.toClassId } }),
    ]);

    if (!fromClass) {
      throw new NotFoundException(
        `From class with ID ${createDto.fromClassId} not found`,
      );
    }
    if (!toClass) {
      throw new NotFoundException(
        `To class with ID ${createDto.toClassId} not found`,
      );
    }

    // Validate student is currently in the from class
    const currentStudentClass = await this.studentClassRepository.findOne({
      where: {
        studentId: createDto.studentId,
        classId: createDto.fromClassId,
        status: StudentClassStatus.ACTIVE,
        year: createDto.year,
      },
    });

    if (!currentStudentClass) {
      throw new BadRequestException(
        `Student is not currently active in the from class for year ${createDto.year}`,
      );
    }

    // Check if student is already in the to class
    const existingToClass = await this.studentClassRepository.findOne({
      where: {
        studentId: createDto.studentId,
        classId: createDto.toClassId,
        status: StudentClassStatus.ACTIVE,
        year: createDto.year,
      },
    });

    if (existingToClass) {
      throw new ConflictException(
        `Student is already active in the to class for year ${createDto.year}`,
      );
    }

    // Check class capacity
    const toClassStudentCount = await this.studentClassRepository.count({
      where: {
        classId: createDto.toClassId,
        status: StudentClassStatus.ACTIVE,
        year: createDto.year,
      },
    });

    if (toClass.capacity && toClassStudentCount >= toClass.capacity) {
      throw new BadRequestException(
        `Target class has reached its capacity of ${toClass.capacity} students`,
      );
    }

    // Create the transfer record
    const transfer = this.studentTransferRepository.create({
      ...createDto,
      transferDate: new Date(createDto.transferDate),
      approvalDate: createDto.approvedBy ? new Date() : undefined,
    });

    const savedTransfer = await this.studentTransferRepository.save(transfer);

    // Update student class statuses
    await this.executeTransfer(savedTransfer.id);

    return this.mapToResponseDto(savedTransfer);
  }

  async executeTransfer(transferId: string): Promise<void> {
    const transfer = await this.studentTransferRepository.findOne({
      where: { id: transferId },
    });

    if (!transfer) {
      throw new NotFoundException(`Transfer with ID ${transferId} not found`);
    }

    // Update the from class status to transferred
    await this.studentClassRepository.update(
      {
        studentId: transfer.studentId,
        classId: transfer.fromClassId,
        status: StudentClassStatus.ACTIVE,
        year: transfer.year,
      },
      {
        status: StudentClassStatus.TRANSFERRED,
        endDate: transfer.transferDate,
      },
    );

    // Create new student class record for the to class
    const newStudentClass = this.studentClassRepository.create({
      studentId: transfer.studentId,
      classId: transfer.toClassId,
      startDate: transfer.transferDate,
      status: StudentClassStatus.ACTIVE,
      year: transfer.year,
    });

    await this.studentClassRepository.save(newStudentClass);
  }

  async findAll(filters?: {
    studentId?: string;
    year?: string;
    reason?: TransferReason;
    fromClassId?: string;
    toClassId?: string;
  }): Promise<StudentTransferResponseDto[]> {
    const queryBuilder = this.studentTransferRepository
      .createQueryBuilder('transfer')
      .leftJoinAndSelect('transfer.student', 'student')
      .leftJoinAndSelect('transfer.fromClass', 'fromClass')
      .leftJoinAndSelect('transfer.toClass', 'toClass')
      .orderBy('transfer.transferDate', 'DESC');

    if (filters?.studentId) {
      queryBuilder.andWhere('transfer.studentId = :studentId', {
        studentId: filters.studentId,
      });
    }

    if (filters?.year) {
      queryBuilder.andWhere('transfer.year = :year', { year: filters.year });
    }

    if (filters?.reason) {
      queryBuilder.andWhere('transfer.reason = :reason', {
        reason: filters.reason,
      });
    }

    if (filters?.fromClassId) {
      queryBuilder.andWhere('transfer.fromClassId = :fromClassId', {
        fromClassId: filters.fromClassId,
      });
    }

    if (filters?.toClassId) {
      queryBuilder.andWhere('transfer.toClassId = :toClassId', {
        toClassId: filters.toClassId,
      });
    }

    const transfers = await queryBuilder.getMany();
    return transfers.map((transfer) => this.mapToResponseDto(transfer));
  }

  async findOne(id: string): Promise<StudentTransferResponseDto> {
    const transfer = await this.studentTransferRepository.findOne({
      where: { id },
      relations: ['student', 'fromClass', 'toClass'],
    });

    if (!transfer) {
      throw new NotFoundException(`Transfer with ID ${id} not found`);
    }

    return this.mapToResponseDto(transfer);
  }

  async update(
    id: string,
    updateDto: UpdateStudentTransferDto,
  ): Promise<StudentTransferResponseDto> {
    const transfer = await this.studentTransferRepository.findOne({
      where: { id },
    });

    if (!transfer) {
      throw new NotFoundException(`Transfer with ID ${id} not found`);
    }

    // Update approval information
    if (updateDto.approvedBy && !transfer.approvedBy) {
      updateDto.approvalDate = new Date().toISOString();
    }

    await this.studentTransferRepository.update(id, {
      ...updateDto,
      approvalDate: updateDto.approvalDate
        ? new Date(updateDto.approvalDate)
        : undefined,
    });

    const updatedTransfer = await this.studentTransferRepository.findOne({
      where: { id },
      relations: ['student', 'fromClass', 'toClass'],
    });

    return this.mapToResponseDto(updatedTransfer!);
  }

  async remove(id: string): Promise<void> {
    const transfer = await this.studentTransferRepository.findOne({
      where: { id },
    });

    if (!transfer) {
      throw new NotFoundException(`Transfer with ID ${id} not found`);
    }

    // Reverse the transfer if it was executed
    await this.reverseTransfer(id);

    await this.studentTransferRepository.remove(transfer);
  }

  async reverseTransfer(transferId: string): Promise<void> {
    const transfer = await this.studentTransferRepository.findOne({
      where: { id: transferId },
    });

    if (!transfer) {
      throw new NotFoundException(`Transfer with ID ${transferId} not found`);
    }

    // Reactivate the original class
    await this.studentClassRepository.update(
      {
        studentId: transfer.studentId,
        classId: transfer.fromClassId,
        year: transfer.year,
      },
      {
        status: StudentClassStatus.ACTIVE,
        endDate: undefined,
      },
    );

    // Remove or deactivate the new class assignment
    await this.studentClassRepository.delete({
      studentId: transfer.studentId,
      classId: transfer.toClassId,
      year: transfer.year,
      startDate: transfer.transferDate,
    });
  }

  async updateStudentClassStatus(
    studentId: string,
    classId: string,
    year: string,
    updateDto: UpdateStudentClassStatusDto,
  ): Promise<void> {
    const studentClass = await this.studentClassRepository.findOne({
      where: { studentId, classId, year },
    });

    if (!studentClass) {
      throw new NotFoundException(
        `Student class record not found for student ${studentId} in class ${classId} for year ${year}`,
      );
    }

    await this.studentClassRepository.update(
      { studentId, classId, year },
      { status: updateDto.status },
    );
  }

  private mapToResponseDto(
    transfer: StudentTransfer,
  ): StudentTransferResponseDto {
    return {
      id: transfer.id,
      studentId: transfer.studentId,
      fromClassId: transfer.fromClassId,
      toClassId: transfer.toClassId,
      transferDate: transfer.transferDate,
      reason: transfer.reason,
      reasonDetails: transfer.reasonDetails,
      year: transfer.year,
      approvedBy: transfer.approvedBy,
      approvalDate: transfer.approvalDate,
      createdAt: transfer.createdAt,
      updatedAt: transfer.updatedAt,
      student: transfer.student
        ? {
            id: transfer.student.id,
            firstName: transfer.student.user?.firstName || '',
            lastName: transfer.student.user?.lastName || '',
            studentNumber: transfer.student.matricule,
          }
        : undefined,
      fromClass: transfer.fromClass
        ? {
            id: transfer.fromClass.id,
            name: transfer.fromClass.name,
            code: transfer.fromClass.code,
            level: transfer.fromClass.level,
          }
        : undefined,
      toClass: transfer.toClass
        ? {
            id: transfer.toClass.id,
            name: transfer.toClass.name,
            code: transfer.toClass.code,
            level: transfer.toClass.level,
          }
        : undefined,
    };
  }
}
