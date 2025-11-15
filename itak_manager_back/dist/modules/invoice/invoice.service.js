"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const invoice_entity_1 = require("../../entities/invoice.entity");
const student_entity_1 = require("../../entities/student.entity");
let InvoiceService = class InvoiceService {
    invoiceRepository;
    studentRepository;
    constructor(invoiceRepository, studentRepository) {
        this.invoiceRepository = invoiceRepository;
        this.studentRepository = studentRepository;
    }
    async create(createInvoiceDto) {
        const student = await this.studentRepository.findOne({
            where: { id: createInvoiceDto.studentId },
        });
        if (!student) {
            throw new common_1.NotFoundException(`Étudiant avec l'ID ${createInvoiceDto.studentId} non trouvé`);
        }
        const existingInvoice = await this.invoiceRepository.findOne({
            where: { invoiceNumber: createInvoiceDto.invoiceNumber },
        });
        if (existingInvoice) {
            throw new common_1.ConflictException(`Une facture avec le numéro ${createInvoiceDto.invoiceNumber} existe déjà`);
        }
        const invoice = this.invoiceRepository.create({
            ...createInvoiceDto,
            status: createInvoiceDto.status || invoice_entity_1.InvoiceStatus.UNPAID,
        });
        return await this.invoiceRepository.save(invoice);
    }
    async findAll() {
        return await this.invoiceRepository.find({
            relations: ['student', 'items'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const invoice = await this.invoiceRepository.findOne({
            where: { id },
            relations: ['student', 'items'],
        });
        if (!invoice) {
            throw new common_1.NotFoundException(`Facture avec l'ID ${id} non trouvée`);
        }
        return invoice;
    }
    async findByStudent(studentId) {
        const student = await this.studentRepository.findOne({
            where: { id: studentId },
        });
        if (!student) {
            throw new common_1.NotFoundException(`Étudiant avec l'ID ${studentId} non trouvé`);
        }
        return await this.invoiceRepository.find({
            where: { studentId },
            relations: ['items'],
            order: { createdAt: 'DESC' },
        });
    }
    async findByInvoiceNumber(invoiceNumber) {
        const invoice = await this.invoiceRepository.findOne({
            where: { invoiceNumber },
            relations: ['student', 'items'],
        });
        if (!invoice) {
            throw new common_1.NotFoundException(`Facture avec le numéro ${invoiceNumber} non trouvée`);
        }
        return invoice;
    }
    async update(id, updateInvoiceDto) {
        const invoice = await this.findOne(id);
        if (updateInvoiceDto.invoiceNumber &&
            updateInvoiceDto.invoiceNumber !== invoice.invoiceNumber) {
            const existingInvoice = await this.invoiceRepository.findOne({
                where: { invoiceNumber: updateInvoiceDto.invoiceNumber },
            });
            if (existingInvoice) {
                throw new common_1.ConflictException(`Une facture avec le numéro ${updateInvoiceDto.invoiceNumber} existe déjà`);
            }
        }
        Object.assign(invoice, updateInvoiceDto);
        return await this.invoiceRepository.save(invoice);
    }
    async remove(id) {
        const invoice = await this.findOne(id);
        await this.invoiceRepository.remove(invoice);
    }
    async generateInvoiceNumber() {
        const currentYear = new Date().getFullYear();
        const count = await this.invoiceRepository.count();
        return `INV-${currentYear}-${String(count + 1).padStart(6, '0')}`;
    }
};
exports.InvoiceService = InvoiceService;
exports.InvoiceService = InvoiceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(invoice_entity_1.Invoice)),
    __param(1, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], InvoiceService);
//# sourceMappingURL=invoice.service.js.map