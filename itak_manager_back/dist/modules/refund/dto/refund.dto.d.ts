import { PaymentResponseDto } from '../../payment/dto/payment.dto';
import { UserResponseDto } from '../../user/dto/user.dto';
export declare class CreateRefundDto {
    paymentId: string;
    amount: number;
    reason?: string;
    processedBy: string;
}
declare const UpdateRefundDto_base: import("@nestjs/common").Type<Partial<CreateRefundDto>>;
export declare class UpdateRefundDto extends UpdateRefundDto_base {
}
export declare class RefundResponseDto {
    id: string;
    paymentId: string;
    amount: number;
    reason?: string;
    processedBy: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    payment?: PaymentResponseDto;
    processedByUser?: UserResponseDto;
}
export declare class RefundSummaryDto {
    totalAmount: number;
    totalRefunds: number;
    refundsByMonth: {
        month: string;
        count: number;
        totalAmount: number;
    }[];
}
export {};
