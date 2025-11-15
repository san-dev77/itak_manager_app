import { InvoiceStatus } from '../../../entities/invoice.entity';
import { StudentResponseDto } from '../../student/dto/student.dto';
export declare class CreateInvoiceDto {
    studentId: string;
    invoiceNumber: string;
    totalAmount: number;
    status?: InvoiceStatus;
    issuedDate: string;
    dueDate?: string;
}
declare const UpdateInvoiceDto_base: import("@nestjs/common").Type<Partial<CreateInvoiceDto>>;
export declare class UpdateInvoiceDto extends UpdateInvoiceDto_base {
}
export declare class InvoiceResponseDto {
    id: string;
    studentId: string;
    invoiceNumber: string;
    totalAmount: number;
    status: InvoiceStatus;
    issuedDate: string | Date;
    dueDate?: string | Date;
    createdAt: string | Date;
    updatedAt: string | Date;
    student?: StudentResponseDto;
    items?: any[];
}
export {};
