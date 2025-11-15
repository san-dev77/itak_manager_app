import { InvoiceItemService } from './invoice-item.service';
import { CreateInvoiceItemDto, UpdateInvoiceItemDto } from './dto/invoice-item.dto';
export declare class InvoiceItemController {
    private readonly invoiceItemService;
    constructor(invoiceItemService: InvoiceItemService);
    create(createInvoiceItemDto: CreateInvoiceItemDto): Promise<import("../../entities/invoice-item.entity").InvoiceItem>;
    findAll(): Promise<import("../../entities/invoice-item.entity").InvoiceItem[]>;
    findByInvoice(invoiceId: string): Promise<import("../../entities/invoice-item.entity").InvoiceItem[]>;
    findOne(id: string): Promise<import("../../entities/invoice-item.entity").InvoiceItem>;
    update(id: string, updateInvoiceItemDto: UpdateInvoiceItemDto): Promise<import("../../entities/invoice-item.entity").InvoiceItem>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
