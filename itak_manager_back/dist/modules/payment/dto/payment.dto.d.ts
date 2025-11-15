import { PaymentMethod, PaymentStatus } from '../../../entities/payment.entity';
import { StudentFeeResponseDto } from '../../student-fee/dto/student-fee.dto';
import { UserResponseDto } from '../../user/dto/user.dto';
export declare class CreatePaymentDto {
    studentFeeId: string;
    paymentDate: string;
    amount: number;
    method: PaymentMethod;
    provider?: string;
    transactionRef?: string;
    receivedBy: string;
    status?: PaymentStatus;
}
declare const UpdatePaymentDto_base: import("@nestjs/common").Type<Partial<CreatePaymentDto>>;
export declare class UpdatePaymentDto extends UpdatePaymentDto_base {
}
export declare class PaymentResponseDto {
    id: string;
    studentFeeId: string;
    paymentDate: string | Date;
    amount: number;
    method: PaymentMethod;
    provider?: string;
    transactionRef?: string;
    receivedBy: string;
    status: PaymentStatus;
    createdAt: string | Date;
    updatedAt: string | Date;
    studentFee?: StudentFeeResponseDto;
    receivedByUser?: UserResponseDto;
}
export declare class PaymentSummaryDto {
    totalAmount: number;
    totalPayments: number;
    paymentsByMethod: {
        method: PaymentMethod;
        count: number;
        totalAmount: number;
    }[];
    paymentsByStatus: {
        status: PaymentStatus;
        count: number;
        totalAmount: number;
    }[];
}
export {};
