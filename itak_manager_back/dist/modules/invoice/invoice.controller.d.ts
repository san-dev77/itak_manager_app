import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dto/invoice.dto';
export declare class InvoiceController {
    private readonly invoiceService;
    constructor(invoiceService: InvoiceService);
    create(createInvoiceDto: CreateInvoiceDto): Promise<import("../../entities/invoice.entity").Invoice>;
    findAll(): Promise<import("../../entities/invoice.entity").Invoice[]>;
    generateInvoiceNumber(): Promise<{
        invoiceNumber: string;
    }>;
    findByStudent(studentId: string): Promise<import("../../entities/invoice.entity").Invoice[]>;
    findByInvoiceNumber(invoiceNumber: string): Promise<import("../../entities/invoice.entity").Invoice>;
    findOne(id: string): Promise<import("../../entities/invoice.entity").Invoice>;
    update(id: string, updateInvoiceDto: UpdateInvoiceDto): Promise<import("../../entities/invoice.entity").Invoice>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
