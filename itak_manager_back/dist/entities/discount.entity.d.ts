import { StudentFee } from './student-fee.entity';
import { User } from './user.entity';
export declare enum DiscountType {
    SCHOLARSHIP = "scholarship",
    SIBLING_DISCOUNT = "sibling_discount",
    EXEMPTION = "exemption",
    OTHER = "other"
}
export declare class Discount {
    id: string;
    studentFeeId: string;
    type: DiscountType;
    description?: string;
    amount: number;
    approvedBy: string;
    createdAt: Date;
    updatedAt: Date;
    studentFee: StudentFee;
    approvedByUser: User;
}
