import { Payment } from './payment.entity';
import { User } from './user.entity';
export declare class Refund {
    id: string;
    paymentId: string;
    amount: number;
    reason?: string;
    processedBy: string;
    createdAt: Date;
    updatedAt: Date;
    payment: Payment;
    processedByUser: User;
}
