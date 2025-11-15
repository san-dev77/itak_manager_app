import { PaymentService } from './payment.service';
import { CreatePaymentDto, UpdatePaymentDto, PaymentSummaryDto } from './dto/payment.dto';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    create(createPaymentDto: CreatePaymentDto): Promise<import("../../entities/payment.entity").Payment>;
    findAll(): Promise<import("../../entities/payment.entity").Payment[]>;
    getSummary(): Promise<PaymentSummaryDto>;
    findByStudentFee(studentFeeId: string): Promise<import("../../entities/payment.entity").Payment[]>;
    findByUser(userId: string): Promise<import("../../entities/payment.entity").Payment[]>;
    findOne(id: string): Promise<import("../../entities/payment.entity").Payment>;
    update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<import("../../entities/payment.entity").Payment>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
