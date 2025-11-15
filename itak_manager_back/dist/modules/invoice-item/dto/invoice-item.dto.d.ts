import { InvoiceResponseDto } from '../../invoice/dto/invoice.dto';
import { StudentFeeResponseDto } from '../../student-fee/dto/student-fee.dto';
export declare class CreateInvoiceItemDto {
    invoiceId: string;
    studentFeeId: string;
    description: string;
    amount: number;
}
declare const UpdateInvoiceItemDto_base: import("@nestjs/common").Type<Partial<CreateInvoiceItemDto>>;
export declare class UpdateInvoiceItemDto extends UpdateInvoiceItemDto_base {
}
export declare class InvoiceItemResponseDto {
    id: string;
    invoiceId: string;
    studentFeeId: string;
    description: string;
    amount: number;
    invoice?: InvoiceResponseDto;
    studentFee?: StudentFeeResponseDto;
}
export {};
