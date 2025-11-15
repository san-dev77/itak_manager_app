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
exports.InvoiceItemService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const invoice_item_entity_1 = require("../../entities/invoice-item.entity");
const invoice_entity_1 = require("../../entities/invoice.entity");
const student_fee_entity_1 = require("../../entities/student-fee.entity");
let InvoiceItemService = class InvoiceItemService {
    invoiceItemRepository;
    invoiceRepository;
    studentFeeRepository;
    constructor(invoiceItemRepository, invoiceRepository, studentFeeRepository) {
        this.invoiceItemRepository = invoiceItemRepository;
        this.invoiceRepository = invoiceRepository;
        this.studentFeeRepository = studentFeeRepository;
    }
    async create(createInvoiceItemDto) {
        const invoice = await this.invoiceRepository.findOne({
            where: { id: createInvoiceItemDto.invoiceId },
        });
        if (!invoice) {
            throw new common_1.NotFoundException(`Facture avec l'ID ${createInvoiceItemDto.invoiceId} non trouvée`);
        }
        const studentFee = await this.studentFeeRepository.findOne({
            where: { id: createInvoiceItemDto.studentFeeId },
        });
        if (!studentFee) {
            throw new common_1.NotFoundException(`Frais étudiant avec l'ID ${createInvoiceItemDto.studentFeeId} non trouvé`);
        }
        const invoiceItem = this.invoiceItemRepository.create(createInvoiceItemDto);
        return await this.invoiceItemRepository.save(invoiceItem);
    }
    async findAll() {
        return await this.invoiceItemRepository.find({
            relations: ['invoice', 'studentFee'],
            order: { invoice: { createdAt: 'DESC' } },
        });
    }
    async findOne(id) {
        const invoiceItem = await this.invoiceItemRepository.findOne({
            where: { id },
            relations: ['invoice', 'studentFee'],
        });
        if (!invoiceItem) {
            throw new common_1.NotFoundException(`Ligne de facture avec l'ID ${id} non trouvée`);
        }
        return invoiceItem;
    }
    async findByInvoice(invoiceId) {
        const invoice = await this.invoiceRepository.findOne({
            where: { id: invoiceId },
        });
        if (!invoice) {
            throw new common_1.NotFoundException(`Facture avec l'ID ${invoiceId} non trouvée`);
        }
        return await this.invoiceItemRepository.find({
            where: { invoiceId },
            relations: ['studentFee'],
        });
    }
    async update(id, updateInvoiceItemDto) {
        const invoiceItem = await this.findOne(id);
        Object.assign(invoiceItem, updateInvoiceItemDto);
        return await this.invoiceItemRepository.save(invoiceItem);
    }
    async remove(id) {
        const invoiceItem = await this.findOne(id);
        await this.invoiceItemRepository.remove(invoiceItem);
    }
};
exports.InvoiceItemService = InvoiceItemService;
exports.InvoiceItemService = InvoiceItemService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(invoice_item_entity_1.InvoiceItem)),
    __param(1, (0, typeorm_1.InjectRepository)(invoice_entity_1.Invoice)),
    __param(2, (0, typeorm_1.InjectRepository)(student_fee_entity_1.StudentFee)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], InvoiceItemService);
//# sourceMappingURL=invoice-item.service.js.map