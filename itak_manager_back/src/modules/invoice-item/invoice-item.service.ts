import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvoiceItem } from '../../entities/invoice-item.entity';
import { Invoice } from '../../entities/invoice.entity';
import { StudentFee } from '../../entities/student-fee.entity';
import {
  CreateInvoiceItemDto,
  UpdateInvoiceItemDto,
} from './dto/invoice-item.dto';

@Injectable()
export class InvoiceItemService {
  constructor(
    @InjectRepository(InvoiceItem)
    private readonly invoiceItemRepository: Repository<InvoiceItem>,
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(StudentFee)
    private readonly studentFeeRepository: Repository<StudentFee>,
  ) {}

  async create(
    createInvoiceItemDto: CreateInvoiceItemDto,
  ): Promise<InvoiceItem> {
    // Vérifier que la facture existe
    const invoice = await this.invoiceRepository.findOne({
      where: { id: createInvoiceItemDto.invoiceId },
    });
    if (!invoice) {
      throw new NotFoundException(
        `Facture avec l'ID ${createInvoiceItemDto.invoiceId} non trouvée`,
      );
    }

    // Vérifier que les frais étudiants existent
    const studentFee = await this.studentFeeRepository.findOne({
      where: { id: createInvoiceItemDto.studentFeeId },
    });
    if (!studentFee) {
      throw new NotFoundException(
        `Frais étudiant avec l'ID ${createInvoiceItemDto.studentFeeId} non trouvé`,
      );
    }

    const invoiceItem = this.invoiceItemRepository.create(createInvoiceItemDto);
    return await this.invoiceItemRepository.save(invoiceItem);
  }

  async findAll(): Promise<InvoiceItem[]> {
    return await this.invoiceItemRepository.find({
      relations: ['invoice', 'studentFee'],
      order: { invoice: { createdAt: 'DESC' } },
    });
  }

  async findOne(id: string): Promise<InvoiceItem> {
    const invoiceItem = await this.invoiceItemRepository.findOne({
      where: { id },
      relations: ['invoice', 'studentFee'],
    });

    if (!invoiceItem) {
      throw new NotFoundException(
        `Ligne de facture avec l'ID ${id} non trouvée`,
      );
    }

    return invoiceItem;
  }

  async findByInvoice(invoiceId: string): Promise<InvoiceItem[]> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id: invoiceId },
    });
    if (!invoice) {
      throw new NotFoundException(`Facture avec l'ID ${invoiceId} non trouvée`);
    }

    return await this.invoiceItemRepository.find({
      where: { invoiceId },
      relations: ['studentFee'],
    });
  }

  async update(
    id: string,
    updateInvoiceItemDto: UpdateInvoiceItemDto,
  ): Promise<InvoiceItem> {
    const invoiceItem = await this.findOne(id);

    Object.assign(invoiceItem, updateInvoiceItemDto);
    return await this.invoiceItemRepository.save(invoiceItem);
  }

  async remove(id: string): Promise<void> {
    const invoiceItem = await this.findOne(id);
    await this.invoiceItemRepository.remove(invoiceItem);
  }
}
