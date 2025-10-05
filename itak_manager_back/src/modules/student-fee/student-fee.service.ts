import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentFee, FeeStatus } from '../../entities/student-fee.entity';
import { Student } from '../../entities/student.entity';
import { FeeType } from '../../entities/fee-type.entity';
import {
  CreateStudentFeeDto,
  UpdateStudentFeeDto,
  PayStudentFeeDto,
  StudentFeesSummaryDto,
} from './dto/student-fee.dto';

@Injectable()
export class StudentFeeService {
  constructor(
    @InjectRepository(StudentFee)
    private readonly studentFeeRepository: Repository<StudentFee>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(FeeType)
    private readonly feeTypeRepository: Repository<FeeType>,
  ) {}

  async create(createStudentFeeDto: CreateStudentFeeDto): Promise<StudentFee> {
    // Vérifier que l'étudiant existe
    const student = await this.studentRepository.findOne({
      where: { id: createStudentFeeDto.studentId },
    });
    if (!student) {
      throw new NotFoundException(
        `Étudiant avec l'ID ${createStudentFeeDto.studentId} non trouvé`,
      );
    }

    // Vérifier que le type de frais existe
    const feeType = await this.feeTypeRepository.findOne({
      where: { id: createStudentFeeDto.feeTypeId },
    });
    if (!feeType) {
      throw new NotFoundException(
        `Type de frais avec l'ID ${createStudentFeeDto.feeTypeId} non trouvé`,
      );
    }

    // Vérifier s'il n'y a pas déjà des frais de ce type pour cet étudiant
    const existingFee = await this.studentFeeRepository.findOne({
      where: {
        studentId: createStudentFeeDto.studentId,
        feeTypeId: createStudentFeeDto.feeTypeId,
      },
    });

    if (existingFee) {
      throw new ConflictException(
        `Des frais de type "${feeType.name}" existent déjà pour cet étudiant`,
      );
    }

    const studentFee = this.studentFeeRepository.create(createStudentFeeDto);

    return await this.studentFeeRepository.save(studentFee);
  }

  async findAll(): Promise<StudentFee[]> {
    return await this.studentFeeRepository.find({
      relations: ['student', 'feeType', 'payments', 'academicYear'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<StudentFee> {
    const studentFee = await this.studentFeeRepository.findOne({
      where: { id },
      relations: ['student', 'feeType', 'payments', 'academicYear'],
    });

    if (!studentFee) {
      throw new NotFoundException(`Frais étudiant avec l'ID ${id} non trouvé`);
    }

    return studentFee;
  }

  async findByStudent(studentId: string): Promise<StudentFee[]> {
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });
    if (!student) {
      throw new NotFoundException(`Étudiant avec l'ID ${studentId} non trouvé`);
    }

    return await this.studentFeeRepository.find({
      where: { studentId },
      relations: ['feeType', 'payments', 'academicYear'],
      order: { createdAt: 'DESC' },
    });
  }

  async getStudentFeesSummary(
    studentId: string,
  ): Promise<StudentFeesSummaryDto> {
    // Charger les frais avec les paiements pour le calcul dynamique
    const fees = await this.studentFeeRepository.find({
      where: { studentId },
      relations: ['feeType', 'payments'],
      order: { createdAt: 'DESC' },
    });

    const totalAssigned = fees.reduce(
      (sum, fee) => sum + Number(fee.amountAssigned),
      0,
    );
    const totalPaid = fees.reduce(
      (sum, fee) => sum + Number(fee.amountPaid),
      0,
    );
    const totalPending = fees
      .filter(
        (fee) =>
          fee.status === FeeStatus.PENDING || fee.status === FeeStatus.PARTIAL,
      )
      .reduce(
        (sum, fee) =>
          sum + (Number(fee.amountAssigned) - Number(fee.amountPaid)),
        0,
      );
    const totalOverdue = fees
      .filter((fee) => fee.status === FeeStatus.OVERDUE)
      .reduce(
        (sum, fee) =>
          sum + (Number(fee.amountAssigned) - Number(fee.amountPaid)),
        0,
      );

    return {
      studentId,
      totalAssigned,
      totalPaid,
      totalPending,
      totalOverdue,
      fees,
    };
  }

  async update(
    id: string,
    updateStudentFeeDto: UpdateStudentFeeDto,
  ): Promise<StudentFee> {
    const studentFee = await this.findOne(id);

    Object.assign(studentFee, updateStudentFeeDto);
    return await this.studentFeeRepository.save(studentFee);
  }

  payFee(id: string, payStudentFeeDto: PayStudentFeeDto): never {
    // Cette méthode est obsolète dans le nouveau système !
    // Les paiements doivent maintenant être créés via PaymentService
    // qui gère automatiquement la mise à jour des statuts
    throw new BadRequestException(
      'Cette méthode est obsolète. Utilisez PaymentService.create() pour enregistrer un paiement.',
    );
  }

  async remove(id: string): Promise<void> {
    const studentFee = await this.findOne(id);
    await this.studentFeeRepository.remove(studentFee);
  }

  async findOverdueFees(): Promise<StudentFee[]> {
    const today = new Date();
    return await this.studentFeeRepository
      .createQueryBuilder('studentFee')
      .leftJoinAndSelect('studentFee.student', 'student')
      .leftJoinAndSelect('studentFee.feeType', 'feeType')
      .where('studentFee.dueDate < :today', { today })
      .andWhere('studentFee.status != :paidStatus', {
        paidStatus: FeeStatus.PAID,
      })
      .orderBy('studentFee.dueDate', 'ASC')
      .getMany();
  }

  async markOverdueFees(): Promise<void> {
    const today = new Date();
    await this.studentFeeRepository
      .createQueryBuilder()
      .update(StudentFee)
      .set({ status: FeeStatus.OVERDUE })
      .where('dueDate < :today', { today })
      .andWhere('status != :paidStatus', { paidStatus: FeeStatus.PAID })
      .execute();
  }
}
