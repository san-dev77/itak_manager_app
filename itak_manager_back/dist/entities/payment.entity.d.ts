import { StudentFee } from './student-fee.entity';
import { User } from './user.entity';
import { Refund } from './refund.entity';
export declare enum PaymentMethod {
    CASH = "cash",
    BANK_TRANSFER = "bank_transfer",
    MOBILE_MONEY = "mobile_money",
    CARD = "card"
}
export declare enum PaymentStatus {
    SUCCESSFUL = "successful",
    FAILED = "failed",
    PENDING = "pending"
}
export declare class Payment {
    id: string;
    studentFeeId: string;
    paymentDate: Date;
    amount: number;
    method: PaymentMethod;
    provider?: string;
    transactionRef?: string;
    receivedBy: string;
    status: PaymentStatus;
    createdAt: Date;
    updatedAt: Date;
    studentFee: StudentFee;
    receivedByUser: User;
    refunds: Refund[];
}
