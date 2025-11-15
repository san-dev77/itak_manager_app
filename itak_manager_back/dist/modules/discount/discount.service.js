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
exports.DiscountService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const discount_entity_1 = require("../../entities/discount.entity");
const student_fee_entity_1 = require("../../entities/student-fee.entity");
const user_entity_1 = require("../../entities/user.entity");
let DiscountService = class DiscountService {
    discountRepository;
    studentFeeRepository;
    userRepository;
    constructor(discountRepository, studentFeeRepository, userRepository) {
        this.discountRepository = discountRepository;
        this.studentFeeRepository = studentFeeRepository;
        this.userRepository = userRepository;
    }
    async create(createDiscountDto) {
        const studentFee = await this.studentFeeRepository.findOne({
            where: { id: createDiscountDto.studentFeeId },
        });
        if (!studentFee) {
            throw new common_1.NotFoundException(`Frais étudiant avec l'ID ${createDiscountDto.studentFeeId} non trouvé`);
        }
        const approvedByUser = await this.userRepository.findOne({
            where: { id: createDiscountDto.approvedBy },
        });
        if (!approvedByUser) {
            throw new common_1.NotFoundException(`Utilisateur avec l'ID ${createDiscountDto.approvedBy} non trouvé`);
        }
        if (createDiscountDto.amount > Number(studentFee.amountAssigned)) {
            throw new common_1.BadRequestException(`Le montant de la réduction (${createDiscountDto.amount}) ne peut pas dépasser le montant assigné (${studentFee.amountAssigned})`);
        }
        const discount = this.discountRepository.create(createDiscountDto);
        return await this.discountRepository.save(discount);
    }
    async findAll() {
        return await this.discountRepository.find({
            relations: ['studentFee', 'approvedByUser'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const discount = await this.discountRepository.findOne({
            where: { id },
            relations: ['studentFee', 'approvedByUser'],
        });
        if (!discount) {
            throw new common_1.NotFoundException(`Réduction avec l'ID ${id} non trouvée`);
        }
        return discount;
    }
    async findByStudentFee(studentFeeId) {
        const studentFee = await this.studentFeeRepository.findOne({
            where: { id: studentFeeId },
        });
        if (!studentFee) {
            throw new common_1.NotFoundException(`Frais étudiant avec l'ID ${studentFeeId} non trouvé`);
        }
        return await this.discountRepository.find({
            where: { studentFeeId },
            relations: ['approvedByUser'],
            order: { createdAt: 'DESC' },
        });
    }
    async update(id, updateDiscountDto) {
        const discount = await this.findOne(id);
        Object.assign(discount, updateDiscountDto);
        return await this.discountRepository.save(discount);
    }
    async remove(id) {
        const discount = await this.findOne(id);
        await this.discountRepository.remove(discount);
    }
};
exports.DiscountService = DiscountService;
exports.DiscountService = DiscountService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(discount_entity_1.Discount)),
    __param(1, (0, typeorm_1.InjectRepository)(student_fee_entity_1.StudentFee)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DiscountService);
//# sourceMappingURL=discount.service.js.map