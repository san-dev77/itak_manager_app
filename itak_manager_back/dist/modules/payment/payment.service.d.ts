import { Repository } from 'typeorm';
import { Payment } from '../../entities/payment.entity';
import { StudentFee } from '../../entities/student-fee.entity';
import { User } from '../../entities/user.entity';
import { CreatePaymentDto, UpdatePaymentDto, PaymentSummaryDto } from './dto/payment.dto';
export declare class PaymentService {
    private readonly paymentRepository;
    private readonly studentFeeRepository;
    private readonly userRepository;
    constructor(paymentRepository: Repository<Payment>, studentFeeRepository: Repository<StudentFee>, userRepository: Repository<User>);
    create(createPaymentDto: CreatePaymentDto): Promise<Payment>;
    private updateStudentFeeAfterPayment;
    findAll(): Promise<Payment[]>;
    findOne(id: string): Promise<Payment>;
    findByStudentFee(studentFeeId: string): Promise<Payment[]>;
    findByUser(userId: string): Promise<Payment[]>;
    update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<Payment>;
    remove(id: string): Promise<void>;
    getPaymentSummary(): Promise<PaymentSummaryDto>;
}
