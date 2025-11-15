import { RefundService } from './refund.service';
import { CreateRefundDto, UpdateRefundDto, RefundSummaryDto } from './dto/refund.dto';
export declare class RefundController {
    private readonly refundService;
    constructor(refundService: RefundService);
    create(createRefundDto: CreateRefundDto): Promise<import("../../entities/refund.entity").Refund>;
    findAll(): Promise<import("../../entities/refund.entity").Refund[]>;
    getSummary(): Promise<RefundSummaryDto>;
    findByPayment(paymentId: string): Promise<import("../../entities/refund.entity").Refund[]>;
    findByUser(userId: string): Promise<import("../../entities/refund.entity").Refund[]>;
    findOne(id: string): Promise<import("../../entities/refund.entity").Refund>;
    update(id: string, updateRefundDto: UpdateRefundDto): Promise<import("../../entities/refund.entity").Refund>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
