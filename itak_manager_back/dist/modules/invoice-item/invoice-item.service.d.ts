import { Repository } from 'typeorm';
import { InvoiceItem } from '../../entities/invoice-item.entity';
import { Invoice } from '../../entities/invoice.entity';
import { StudentFee } from '../../entities/student-fee.entity';
import { CreateInvoiceItemDto, UpdateInvoiceItemDto } from './dto/invoice-item.dto';
export declare class InvoiceItemService {
    private readonly invoiceItemRepository;
    private readonly invoiceRepository;
    private readonly studentFeeRepository;
    constructor(invoiceItemRepository: Repository<InvoiceItem>, invoiceRepository: Repository<Invoice>, studentFeeRepository: Repository<StudentFee>);
    create(createInvoiceItemDto: CreateInvoiceItemDto): Promise<InvoiceItem>;
    findAll(): Promise<InvoiceItem[]>;
    findOne(id: string): Promise<InvoiceItem>;
    findByInvoice(invoiceId: string): Promise<InvoiceItem[]>;
    update(id: string, updateInvoiceItemDto: UpdateInvoiceItemDto): Promise<InvoiceItem>;
    remove(id: string): Promise<void>;
}
