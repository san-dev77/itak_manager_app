import { Student } from './student.entity';
import { FeeType } from './fee-type.entity';
import { Payment } from './payment.entity';
import { SchoolYear } from './school-year.entity';
import { Discount } from './discount.entity';
import { InvoiceItem } from './invoice-item.entity';
export declare enum FeeStatus {
    PENDING = "pending",
    PARTIAL = "partial",
    PAID = "paid",
    OVERDUE = "overdue"
}
export declare class StudentFee {
    id: string;
    studentId: string;
    feeTypeId: string;
    academicYearId: string;
    amountAssigned: number;
    dueDate?: Date;
    status: FeeStatus;
    createdAt: Date;
    updatedAt: Date;
    student: Student;
    feeType: FeeType;
    academicYear: SchoolYear;
    payments: Payment[];
    discounts: Discount[];
    invoiceItems: InvoiceItem[];
    get amountPaid(): number;
}
