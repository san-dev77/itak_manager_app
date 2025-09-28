import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice, InvoiceStatus } from '../../entities/invoice.entity';
import { Student } from '../../entities/student.entity';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dto/invoice.dto';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    // Vérifier que l'étudiant existe
    const student = await this.studentRepository.findOne({
      where: { id: createInvoiceDto.studentId },
    });
    if (!student) {
      throw new NotFoundException(
        `Étudiant avec l'ID ${createInvoiceDto.studentId} non trouvé`,
      );
    }

    // Vérifier l'unicité du numéro de facture
    const existingInvoice = await this.invoiceRepository.findOne({
      where: { invoiceNumber: createInvoiceDto.invoiceNumber },
    });
    if (existingInvoice) {
      throw new ConflictException(
        `Une facture avec le numéro ${createInvoiceDto.invoiceNumber} existe déjà`,
      );
    }

    const invoice = this.invoiceRepository.create({
      ...createInvoiceDto,
      status: createInvoiceDto.status || InvoiceStatus.UNPAID,
    });

    return await this.invoiceRepository.save(invoice);
  }

  async findAll(): Promise<Invoice[]> {
    return await this.invoiceRepository.find({
      relations: ['student', 'items'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['student', 'items'],
    });

    if (!invoice) {
      throw new NotFoundException(`Facture avec l'ID ${id} non trouvée`);
    }

    return invoice;
  }

  async findByStudent(studentId: string): Promise<Invoice[]> {
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });
    if (!student) {
      throw new NotFoundException(`Étudiant avec l'ID ${studentId} non trouvé`);
    }

    return await this.invoiceRepository.find({
      where: { studentId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByInvoiceNumber(invoiceNumber: string): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { invoiceNumber },
      relations: ['student', 'items'],
    });

    if (!invoice) {
      throw new NotFoundException(
        `Facture avec le numéro ${invoiceNumber} non trouvée`,
      );
    }

    return invoice;
  }

  async update(
    id: string,
    updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<Invoice> {
    const invoice = await this.findOne(id);

    // Vérifier l'unicité du numéro de facture si modifié
    if (
      updateInvoiceDto.invoiceNumber &&
      updateInvoiceDto.invoiceNumber !== invoice.invoiceNumber
    ) {
      const existingInvoice = await this.invoiceRepository.findOne({
        where: { invoiceNumber: updateInvoiceDto.invoiceNumber },
      });
      if (existingInvoice) {
        throw new ConflictException(
          `Une facture avec le numéro ${updateInvoiceDto.invoiceNumber} existe déjà`,
        );
      }
    }

    Object.assign(invoice, updateInvoiceDto);
    return await this.invoiceRepository.save(invoice);
  }

  async remove(id: string): Promise<void> {
    const invoice = await this.findOne(id);
    await this.invoiceRepository.remove(invoice);
  }

  async generateInvoiceNumber(): Promise<string> {
    const currentYear = new Date().getFullYear();
    const count = await this.invoiceRepository.count();
    return `INV-${currentYear}-${String(count + 1).padStart(6, '0')}`;
  }
}
