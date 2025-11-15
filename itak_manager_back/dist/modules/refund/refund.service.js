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
exports.RefundService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const refund_entity_1 = require("../../entities/refund.entity");
const payment_entity_1 = require("../../entities/payment.entity");
const user_entity_1 = require("../../entities/user.entity");
const student_fee_entity_1 = require("../../entities/student-fee.entity");
let RefundService = class RefundService {
    refundRepository;
    paymentRepository;
    userRepository;
    studentFeeRepository;
    constructor(refundRepository, paymentRepository, userRepository, studentFeeRepository) {
        this.refundRepository = refundRepository;
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
        this.studentFeeRepository = studentFeeRepository;
    }
    async create(createRefundDto) {
        const payment = await this.paymentRepository.findOne({
            where: { id: createRefundDto.paymentId },
            relations: ['studentFee'],
        });
        if (!payment) {
            throw new common_1.NotFoundException(`Paiement avec l'ID ${createRefundDto.paymentId} non trouvé`);
        }
        if (payment.status !== payment_entity_1.PaymentStatus.SUCCESSFUL) {
            throw new common_1.BadRequestException("Impossible de rembourser un paiement qui n'est pas réussi");
        }
        const processedByUser = await this.userRepository.findOne({
            where: { id: createRefundDto.processedBy },
        });
        if (!processedByUser) {
            throw new common_1.NotFoundException(`Utilisateur avec l'ID ${createRefundDto.processedBy} non trouvé`);
        }
        const existingRefunds = await this.refundRepository.find({
            where: { paymentId: createRefundDto.paymentId },
        });
        const totalRefunded = existingRefunds.reduce((sum, refund) => sum + Number(refund.amount), 0);
        const availableForRefund = Number(payment.amount) - totalRefunded;
        if (createRefundDto.amount > availableForRefund) {
            throw new common_1.BadRequestException(`Le montant du remboursement (${createRefundDto.amount}) dépasse le montant disponible (${availableForRefund})`);
        }
        const refund = this.refundRepository.create(createRefundDto);
        const savedRefund = await this.refundRepository.save(refund);
        if (payment.studentFee) {
            await this.updateStudentFeeAfterRefund(payment.studentFee, createRefundDto.amount);
        }
        return savedRefund;
    }
    async updateStudentFeeAfterRefund(studentFee, refundAmount) {
        const updatedStudentFee = await this.studentFeeRepository.findOne({
            where: { id: studentFee.id },
            relations: ['payments'],
        });
        if (!updatedStudentFee)
            return;
        const currentAmountPaid = updatedStudentFee.amountPaid;
        if (currentAmountPaid <= 0) {
            updatedStudentFee.status = student_fee_entity_1.FeeStatus.PENDING;
        }
        else if (currentAmountPaid < Number(updatedStudentFee.amountAssigned)) {
            updatedStudentFee.status = student_fee_entity_1.FeeStatus.PARTIAL;
        }
        else {
            updatedStudentFee.status = student_fee_entity_1.FeeStatus.PAID;
        }
        await this.studentFeeRepository.save(updatedStudentFee);
    }
    async findAll() {
        return await this.refundRepository.find({
            relations: ['payment', 'processedByUser'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const refund = await this.refundRepository.findOne({
            where: { id },
            relations: ['payment', 'processedByUser'],
        });
        if (!refund) {
            throw new common_1.NotFoundException(`Remboursement avec l'ID ${id} non trouvé`);
        }
        return refund;
    }
    async findByPayment(paymentId) {
        const payment = await this.paymentRepository.findOne({
            where: { id: paymentId },
        });
        if (!payment) {
            throw new common_1.NotFoundException(`Paiement avec l'ID ${paymentId} non trouvé`);
        }
        return await this.refundRepository.find({
            where: { paymentId },
            relations: ['processedByUser'],
            order: { createdAt: 'DESC' },
        });
    }
    async findByUser(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé`);
        }
        return await this.refundRepository.find({
            where: { processedBy: userId },
            relations: ['payment'],
            order: { createdAt: 'DESC' },
        });
    }
    async update(id, updateRefundDto) {
        const refund = await this.findOne(id);
        Object.assign(refund, updateRefundDto);
        return await this.refundRepository.save(refund);
    }
    async remove(id) {
        const refund = await this.refundRepository.findOne({
            where: { id },
            relations: ['payment', 'payment.studentFee'],
        });
        if (!refund) {
            throw new common_1.NotFoundException(`Remboursement avec l'ID ${id} non trouvé`);
        }
        if (refund.payment?.studentFee) {
            const updatedStudentFee = await this.studentFeeRepository.findOne({
                where: { id: refund.payment.studentFee.id },
                relations: ['payments'],
            });
            if (updatedStudentFee) {
                const currentAmountPaid = updatedStudentFee.amountPaid;
                if (currentAmountPaid >= Number(updatedStudentFee.amountAssigned)) {
                    updatedStudentFee.status = student_fee_entity_1.FeeStatus.PAID;
                }
                else if (currentAmountPaid > 0) {
                    updatedStudentFee.status = student_fee_entity_1.FeeStatus.PARTIAL;
                }
                else {
                    updatedStudentFee.status = student_fee_entity_1.FeeStatus.PENDING;
                }
                await this.studentFeeRepository.save(updatedStudentFee);
            }
        }
        await this.refundRepository.remove(refund);
    }
    async getRefundSummary() {
        const refunds = await this.refundRepository.find();
        const totalAmount = refunds.reduce((sum, refund) => sum + Number(refund.amount), 0);
        const totalRefunds = refunds.length;
        const monthGroups = refunds.reduce((acc, refund) => {
            const month = refund.createdAt.toISOString().substring(0, 7);
            if (!acc[month]) {
                acc[month] = { count: 0, totalAmount: 0 };
            }
            acc[month].count++;
            acc[month].totalAmount += Number(refund.amount);
            return acc;
        }, {});
        const refundsByMonth = Object.entries(monthGroups).map(([month, data]) => ({
            month,
            count: data.count,
            totalAmount: data.totalAmount,
        }));
        return {
            totalAmount,
            totalRefunds,
            refundsByMonth,
        };
    }
};
exports.RefundService = RefundService;
exports.RefundService = RefundService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(refund_entity_1.Refund)),
    __param(1, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(student_fee_entity_1.StudentFee)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RefundService);
//# sourceMappingURL=refund.service.js.map