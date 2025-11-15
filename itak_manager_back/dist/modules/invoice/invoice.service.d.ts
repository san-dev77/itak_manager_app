import { Repository } from 'typeorm';
import { Invoice } from '../../entities/invoice.entity';
import { Student } from '../../entities/student.entity';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dto/invoice.dto';
export declare class InvoiceService {
    private readonly invoiceRepository;
    private readonly studentRepository;
    constructor(invoiceRepository: Repository<Invoice>, studentRepository: Repository<Student>);
    create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice>;
    findAll(): Promise<Invoice[]>;
    findOne(id: string): Promise<Invoice>;
    findByStudent(studentId: string): Promise<Invoice[]>;
    findByInvoiceNumber(invoiceNumber: string): Promise<Invoice>;
    update(id: string, updateInvoiceDto: UpdateInvoiceDto): Promise<Invoice>;
    remove(id: string): Promise<void>;
    generateInvoiceNumber(): Promise<string>;
}
