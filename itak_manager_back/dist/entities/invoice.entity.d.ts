import { Student } from './student.entity';
import { InvoiceItem } from './invoice-item.entity';
export declare enum InvoiceStatus {
    UNPAID = "unpaid",
    PARTIAL = "partial",
    PAID = "paid",
    CANCELLED = "cancelled"
}
export declare class Invoice {
    id: string;
    studentId: string;
    invoiceNumber: string;
    totalAmount: number;
    status: InvoiceStatus;
    issuedDate: Date;
    dueDate?: Date;
    createdAt: Date;
    updatedAt: Date;
    student: Student;
    items: InvoiceItem[];
}
