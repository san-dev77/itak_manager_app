import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Payment,
  PaymentMethod,
  PaymentStatus,
} from '../../entities/payment.entity';
import { StudentFee, FeeStatus } from '../../entities/student-fee.entity';
import { User } from '../../entities/user.entity';
import {
  CreatePaymentDto,
  UpdatePaymentDto,
  PaymentSummaryDto,
} from './dto/payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(StudentFee)
    private readonly studentFeeRepository: Repository<StudentFee>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    // Vérifier que les frais étudiants existent
    const studentFee = await this.studentFeeRepository.findOne({
      where: { id: createPaymentDto.studentFeeId },
    });
    if (!studentFee) {
      throw new NotFoundException(
        `Frais étudiant avec l'ID ${createPaymentDto.studentFeeId} non trouvé`,
      );
    }

    // Vérifier que l'utilisateur qui reçoit le paiement existe
    const receivedByUser = await this.userRepository.findOne({
      where: { id: createPaymentDto.receivedBy },
    });
    if (!receivedByUser) {
      throw new NotFoundException(
        `Utilisateur avec l'ID ${createPaymentDto.receivedBy} non trouvé`,
      );
    }

    // Vérifier que le montant ne dépasse pas le montant restant à payer
    const remainingAmount =
      Number(studentFee.amountAssigned) - Number(studentFee.amountPaid);
    if (createPaymentDto.amount > remainingAmount) {
      throw new BadRequestException(
        `Le montant du paiement (${createPaymentDto.amount}) dépasse le montant restant (${remainingAmount})`,
      );
    }

    // Créer le paiement
    const payment = this.paymentRepository.create({
      ...createPaymentDto,
      status: createPaymentDto.status || PaymentStatus.SUCCESSFUL,
    });

    const savedPayment = await this.paymentRepository.save(payment);

    // Mettre à jour les frais étudiants si le paiement est réussi
    if (savedPayment.status === PaymentStatus.SUCCESSFUL) {
      await this.updateStudentFeeAfterPayment(
        studentFee,
        createPaymentDto.amount,
      );
    }

    return savedPayment;
  }

  private async updateStudentFeeAfterPayment(
    studentFee: StudentFee,
    paymentAmount: number,
  ): Promise<void> {
    // Recharger les paiements pour avoir les données à jour
    const updatedStudentFee = await this.studentFeeRepository.findOne({
      where: { id: studentFee.id },
      relations: ['payments'],
    });

    if (!updatedStudentFee) return;

    // Le montant payé est maintenant calculé automatiquement via le getter
    const currentAmountPaid = updatedStudentFee.amountPaid;

    // Mettre à jour le statut basé sur le nouveau montant payé
    if (currentAmountPaid >= Number(updatedStudentFee.amountAssigned)) {
      updatedStudentFee.status = FeeStatus.PAID;
    } else if (currentAmountPaid > 0) {
      updatedStudentFee.status = FeeStatus.PARTIAL;
    }

    await this.studentFeeRepository.save(updatedStudentFee);
  }

  async findAll(): Promise<Payment[]> {
    return await this.paymentRepository.find({
      relations: ['studentFee', 'studentFee.academicYear', 'receivedByUser'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['studentFee', 'receivedByUser', 'refunds'],
    });

    if (!payment) {
      throw new NotFoundException(`Paiement avec l'ID ${id} non trouvé`);
    }

    return payment;
  }

  async findByStudentFee(studentFeeId: string): Promise<Payment[]> {
    const studentFee = await this.studentFeeRepository.findOne({
      where: { id: studentFeeId },
    });
    if (!studentFee) {
      throw new NotFoundException(
        `Frais étudiant avec l'ID ${studentFeeId} non trouvé`,
      );
    }

    return await this.paymentRepository.find({
      where: { studentFeeId },
      relations: ['receivedByUser'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: string): Promise<Payment[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé`);
    }

    return await this.paymentRepository.find({
      where: { receivedBy: userId },
      relations: ['studentFee'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(
    id: string,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment> {
    const payment = await this.findOne(id);

    // Si on change le statut vers SUCCESSFUL et qu'il n'était pas SUCCESSFUL avant
    if (
      updatePaymentDto.status === PaymentStatus.SUCCESSFUL &&
      payment.status !== PaymentStatus.SUCCESSFUL
    ) {
      const studentFee = await this.studentFeeRepository.findOne({
        where: { id: payment.studentFeeId },
      });
      if (studentFee) {
        await this.updateStudentFeeAfterPayment(
          studentFee,
          Number(payment.amount),
        );
      }
    }

    Object.assign(payment, updatePaymentDto);
    return await this.paymentRepository.save(payment);
  }

  async remove(id: string): Promise<void> {
    const payment = await this.findOne(id);

    // Si le paiement était réussi, recalculer le statut des frais étudiants
    if (payment.status === PaymentStatus.SUCCESSFUL) {
      const studentFee = await this.studentFeeRepository.findOne({
        where: { id: payment.studentFeeId },
        relations: ['payments'],
      });
      if (studentFee) {
        // Le montant payé sera recalculé automatiquement après suppression du paiement
        const currentAmountPaid = studentFee.amountPaid;

        // Recalculer le statut
        if (currentAmountPaid <= 0) {
          studentFee.status = FeeStatus.PENDING;
        } else if (currentAmountPaid < Number(studentFee.amountAssigned)) {
          studentFee.status = FeeStatus.PARTIAL;
        } else {
          studentFee.status = FeeStatus.PAID;
        }

        await this.studentFeeRepository.save(studentFee);
      }
    }

    await this.paymentRepository.remove(payment);
  }

  async getPaymentSummary(): Promise<PaymentSummaryDto> {
    const payments = await this.paymentRepository.find();

    const totalAmount = payments.reduce(
      (sum, payment) => sum + Number(payment.amount),
      0,
    );
    const totalPayments = payments.length;

    // Grouper par méthode
    const methodGroups = payments.reduce(
      (acc, payment) => {
        if (!acc[payment.method]) {
          acc[payment.method] = { count: 0, totalAmount: 0 };
        }
        acc[payment.method].count++;
        acc[payment.method].totalAmount += Number(payment.amount);
        return acc;
      },
      {} as Record<PaymentMethod, { count: number; totalAmount: number }>,
    );

    const paymentsByMethod = Object.entries(methodGroups).map(
      ([method, data]) => ({
        method: method as PaymentMethod,
        count: data.count,
        totalAmount: data.totalAmount,
      }),
    );

    // Grouper par statut
    const statusGroups = payments.reduce(
      (acc, payment) => {
        if (!acc[payment.status]) {
          acc[payment.status] = { count: 0, totalAmount: 0 };
        }
        acc[payment.status].count++;
        acc[payment.status].totalAmount += Number(payment.amount);
        return acc;
      },
      {} as Record<PaymentStatus, { count: number; totalAmount: number }>,
    );

    const paymentsByStatus = Object.entries(statusGroups).map(
      ([status, data]) => ({
        status: status as PaymentStatus,
        count: data.count,
        totalAmount: data.totalAmount,
      }),
    );

    return {
      totalAmount,
      totalPayments,
      paymentsByMethod,
      paymentsByStatus,
    };
  }
}
