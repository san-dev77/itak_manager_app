import { Repository } from 'typeorm';
import { Refund } from '../../entities/refund.entity';
import { Payment } from '../../entities/payment.entity';
import { User } from '../../entities/user.entity';
import { StudentFee } from '../../entities/student-fee.entity';
import { CreateRefundDto, UpdateRefundDto, RefundSummaryDto } from './dto/refund.dto';
export declare class RefundService {
    private readonly refundRepository;
    private readonly paymentRepository;
    private readonly userRepository;
    private readonly studentFeeRepository;
    constructor(refundRepository: Repository<Refund>, paymentRepository: Repository<Payment>, userRepository: Repository<User>, studentFeeRepository: Repository<StudentFee>);
    create(createRefundDto: CreateRefundDto): Promise<Refund>;
    private updateStudentFeeAfterRefund;
    findAll(): Promise<Refund[]>;
    findOne(id: string): Promise<Refund>;
    findByPayment(paymentId: string): Promise<Refund[]>;
    findByUser(userId: string): Promise<Refund[]>;
    update(id: string, updateRefundDto: UpdateRefundDto): Promise<Refund>;
    remove(id: string): Promise<void>;
    getRefundSummary(): Promise<RefundSummaryDto>;
}
