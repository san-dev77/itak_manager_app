import { StudentFee } from './student-fee.entity';
export declare enum FeeFrequency {
    ONCE = "once",
    MONTHLY = "monthly",
    QUARTERLY = "quarterly",
    YEARLY = "yearly"
}
export declare class FeeType {
    id: string;
    name: string;
    description?: string;
    amountDefault: number;
    isRecurring: boolean;
    frequency?: FeeFrequency;
    createdAt: Date;
    updatedAt: Date;
    studentFees: StudentFee[];
}
