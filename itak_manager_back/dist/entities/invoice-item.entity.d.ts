import { Invoice } from './invoice.entity';
import { StudentFee } from './student-fee.entity';
export declare class InvoiceItem {
    id: string;
    invoiceId: string;
    studentFeeId: string;
    description: string;
    amount: number;
    invoice: Invoice;
    studentFee: StudentFee;
}
