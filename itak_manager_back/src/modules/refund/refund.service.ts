import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Refund } from '../../entities/refund.entity';
import { Payment, PaymentStatus } from '../../entities/payment.entity';
import { User } from '../../entities/user.entity';
import { StudentFee, FeeStatus } from '../../entities/student-fee.entity';
import {
  CreateRefundDto,
  UpdateRefundDto,
  RefundSummaryDto,
} from './dto/refund.dto';

@Injectable()
export class RefundService {
  constructor(
    @InjectRepository(Refund)
    private readonly refundRepository: Repository<Refund>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(StudentFee)
    private readonly studentFeeRepository: Repository<StudentFee>,
  ) {}

  async create(createRefundDto: CreateRefundDto): Promise<Refund> {
    // Vérifier que le paiement existe
    const payment = await this.paymentRepository.findOne({
      where: { id: createRefundDto.paymentId },
      relations: ['studentFee'],
    });
    if (!payment) {
      throw new NotFoundException(
        `Paiement avec l'ID ${createRefundDto.paymentId} non trouvé`,
      );
    }

    // Vérifier que le paiement était réussi
    if (payment.status !== PaymentStatus.SUCCESSFUL) {
      throw new BadRequestException(
        "Impossible de rembourser un paiement qui n'est pas réussi",
      );
    }

    // Vérifier que l'utilisateur qui traite le remboursement existe
    const processedByUser = await this.userRepository.findOne({
      where: { id: createRefundDto.processedBy },
    });
    if (!processedByUser) {
      throw new NotFoundException(
        `Utilisateur avec l'ID ${createRefundDto.processedBy} non trouvé`,
      );
    }

    // Vérifier que le montant du remboursement ne dépasse pas le montant du paiement
    const existingRefunds = await this.refundRepository.find({
      where: { paymentId: createRefundDto.paymentId },
    });
    const totalRefunded = existingRefunds.reduce(
      (sum, refund) => sum + Number(refund.amount),
      0,
    );
    const availableForRefund = Number(payment.amount) - totalRefunded;

    if (createRefundDto.amount > availableForRefund) {
      throw new BadRequestException(
        `Le montant du remboursement (${createRefundDto.amount}) dépasse le montant disponible (${availableForRefund})`,
      );
    }

    // Créer le remboursement
    const refund = this.refundRepository.create(createRefundDto);
    const savedRefund = await this.refundRepository.save(refund);

    // Mettre à jour les frais étudiants
    if (payment.studentFee) {
      await this.updateStudentFeeAfterRefund(
        payment.studentFee,
        createRefundDto.amount,
      );
    }

    return savedRefund;
  }

  private async updateStudentFeeAfterRefund(
    studentFee: StudentFee,
    refundAmount: number,
  ): Promise<void> {
    // Recharger les paiements pour avoir les données à jour
    const updatedStudentFee = await this.studentFeeRepository.findOne({
      where: { id: studentFee.id },
      relations: ['payments'],
    });

    if (!updatedStudentFee) return;

    // Le montant payé est maintenant calculé automatiquement via le getter
    const currentAmountPaid = updatedStudentFee.amountPaid;

    // Recalculer le statut basé sur le nouveau montant payé (après remboursement)
    if (currentAmountPaid <= 0) {
      updatedStudentFee.status = FeeStatus.PENDING;
    } else if (currentAmountPaid < Number(updatedStudentFee.amountAssigned)) {
      updatedStudentFee.status = FeeStatus.PARTIAL;
    } else {
      updatedStudentFee.status = FeeStatus.PAID;
    }

    await this.studentFeeRepository.save(updatedStudentFee);
  }

  async findAll(): Promise<Refund[]> {
    return await this.refundRepository.find({
      relations: ['payment', 'processedByUser'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Refund> {
    const refund = await this.refundRepository.findOne({
      where: { id },
      relations: ['payment', 'processedByUser'],
    });

    if (!refund) {
      throw new NotFoundException(`Remboursement avec l'ID ${id} non trouvé`);
    }

    return refund;
  }

  async findByPayment(paymentId: string): Promise<Refund[]> {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
    });
    if (!payment) {
      throw new NotFoundException(`Paiement avec l'ID ${paymentId} non trouvé`);
    }

    return await this.refundRepository.find({
      where: { paymentId },
      relations: ['processedByUser'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: string): Promise<Refund[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé`);
    }

    return await this.refundRepository.find({
      where: { processedBy: userId },
      relations: ['payment'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updateRefundDto: UpdateRefundDto): Promise<Refund> {
    const refund = await this.findOne(id);

    Object.assign(refund, updateRefundDto);
    return await this.refundRepository.save(refund);
  }

  async remove(id: string): Promise<void> {
    const refund = await this.refundRepository.findOne({
      where: { id },
      relations: ['payment', 'payment.studentFee'],
    });

    if (!refund) {
      throw new NotFoundException(`Remboursement avec l'ID ${id} non trouvé`);
    }

    // Rétablir les frais étudiants (recalculer le statut après suppression du remboursement)
    if (refund.payment?.studentFee) {
      // Recharger avec les paiements pour avoir le calcul à jour
      const updatedStudentFee = await this.studentFeeRepository.findOne({
        where: { id: refund.payment.studentFee.id },
        relations: ['payments'],
      });

      if (updatedStudentFee) {
        // Le montant payé sera recalculé automatiquement après suppression du remboursement
        const currentAmountPaid = updatedStudentFee.amountPaid;

        // Recalculer le statut
        if (currentAmountPaid >= Number(updatedStudentFee.amountAssigned)) {
          updatedStudentFee.status = FeeStatus.PAID;
        } else if (currentAmountPaid > 0) {
          updatedStudentFee.status = FeeStatus.PARTIAL;
        } else {
          updatedStudentFee.status = FeeStatus.PENDING;
        }

        await this.studentFeeRepository.save(updatedStudentFee);
      }
    }

    await this.refundRepository.remove(refund);
  }

  async getRefundSummary(): Promise<RefundSummaryDto> {
    const refunds = await this.refundRepository.find();

    const totalAmount = refunds.reduce(
      (sum, refund) => sum + Number(refund.amount),
      0,
    );
    const totalRefunds = refunds.length;

    // Grouper par mois
    const monthGroups = refunds.reduce(
      (acc, refund) => {
        const month = refund.createdAt.toISOString().substring(0, 7); // YYYY-MM
        if (!acc[month]) {
          acc[month] = { count: 0, totalAmount: 0 };
        }
        acc[month].count++;
        acc[month].totalAmount += Number(refund.amount);
        return acc;
      },
      {} as Record<string, { count: number; totalAmount: number }>,
    );

    const refundsByMonth = Object.entries(monthGroups).map(([month, data]) => ({
      month,
      count: data.count,
      totalAmount: data.totalAmount,
    }));

    return {
      totalAmount,
      totalRefunds,
      refundsByMonth,
    };
  }
}
