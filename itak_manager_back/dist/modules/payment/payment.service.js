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
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_entity_1 = require("../../entities/payment.entity");
const student_fee_entity_1 = require("../../entities/student-fee.entity");
const user_entity_1 = require("../../entities/user.entity");
let PaymentService = class PaymentService {
    paymentRepository;
    studentFeeRepository;
    userRepository;
    constructor(paymentRepository, studentFeeRepository, userRepository) {
        this.paymentRepository = paymentRepository;
        this.studentFeeRepository = studentFeeRepository;
        this.userRepository = userRepository;
    }
    async create(createPaymentDto) {
        const studentFee = await this.studentFeeRepository.findOne({
            where: { id: createPaymentDto.studentFeeId },
        });
        if (!studentFee) {
            throw new common_1.NotFoundException(`Frais étudiant avec l'ID ${createPaymentDto.studentFeeId} non trouvé`);
        }
        const receivedByUser = await this.userRepository.findOne({
            where: { id: createPaymentDto.receivedBy },
        });
        if (!receivedByUser) {
            throw new common_1.NotFoundException(`Utilisateur avec l'ID ${createPaymentDto.receivedBy} non trouvé`);
        }
        const remainingAmount = Number(studentFee.amountAssigned) - Number(studentFee.amountPaid);
        if (createPaymentDto.amount > remainingAmount) {
            throw new common_1.BadRequestException(`Le montant du paiement (${createPaymentDto.amount}) dépasse le montant restant (${remainingAmount})`);
        }
        const payment = this.paymentRepository.create({
            ...createPaymentDto,
            status: createPaymentDto.status || payment_entity_1.PaymentStatus.SUCCESSFUL,
        });
        const savedPayment = await this.paymentRepository.save(payment);
        if (savedPayment.status === payment_entity_1.PaymentStatus.SUCCESSFUL) {
            await this.updateStudentFeeAfterPayment(studentFee, createPaymentDto.amount);
        }
        return savedPayment;
    }
    async updateStudentFeeAfterPayment(studentFee, paymentAmount) {
        const updatedStudentFee = await this.studentFeeRepository.findOne({
            where: { id: studentFee.id },
            relations: ['payments'],
        });
        if (!updatedStudentFee)
            return;
        const currentAmountPaid = updatedStudentFee.amountPaid;
        if (currentAmountPaid >= Number(updatedStudentFee.amountAssigned)) {
            updatedStudentFee.status = student_fee_entity_1.FeeStatus.PAID;
        }
        else if (currentAmountPaid > 0) {
            updatedStudentFee.status = student_fee_entity_1.FeeStatus.PARTIAL;
        }
        await this.studentFeeRepository.save(updatedStudentFee);
    }
    async findAll() {
        return await this.paymentRepository.find({
            relations: ['studentFee', 'receivedByUser'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const payment = await this.paymentRepository.findOne({
            where: { id },
            relations: ['studentFee', 'receivedByUser', 'refunds'],
        });
        if (!payment) {
            throw new common_1.NotFoundException(`Paiement avec l'ID ${id} non trouvé`);
        }
        return payment;
    }
    async findByStudentFee(studentFeeId) {
        const studentFee = await this.studentFeeRepository.findOne({
            where: { id: studentFeeId },
        });
        if (!studentFee) {
            throw new common_1.NotFoundException(`Frais étudiant avec l'ID ${studentFeeId} non trouvé`);
        }
        return await this.paymentRepository.find({
            where: { studentFeeId },
            relations: ['receivedByUser'],
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
        return await this.paymentRepository.find({
            where: { receivedBy: userId },
            relations: ['studentFee'],
            order: { createdAt: 'DESC' },
        });
    }
    async update(id, updatePaymentDto) {
        const payment = await this.findOne(id);
        if (updatePaymentDto.status === payment_entity_1.PaymentStatus.SUCCESSFUL &&
            payment.status !== payment_entity_1.PaymentStatus.SUCCESSFUL) {
            const studentFee = await this.studentFeeRepository.findOne({
                where: { id: payment.studentFeeId },
            });
            if (studentFee) {
                await this.updateStudentFeeAfterPayment(studentFee, Number(payment.amount));
            }
        }
        Object.assign(payment, updatePaymentDto);
        return await this.paymentRepository.save(payment);
    }
    async remove(id) {
        const payment = await this.findOne(id);
        if (payment.status === payment_entity_1.PaymentStatus.SUCCESSFUL) {
            const studentFee = await this.studentFeeRepository.findOne({
                where: { id: payment.studentFeeId },
                relations: ['payments'],
            });
            if (studentFee) {
                const currentAmountPaid = studentFee.amountPaid;
                if (currentAmountPaid <= 0) {
                    studentFee.status = student_fee_entity_1.FeeStatus.PENDING;
                }
                else if (currentAmountPaid < Number(studentFee.amountAssigned)) {
                    studentFee.status = student_fee_entity_1.FeeStatus.PARTIAL;
                }
                else {
                    studentFee.status = student_fee_entity_1.FeeStatus.PAID;
                }
                await this.studentFeeRepository.save(studentFee);
            }
        }
        await this.paymentRepository.remove(payment);
    }
    async getPaymentSummary() {
        const payments = await this.paymentRepository.find();
        const totalAmount = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
        const totalPayments = payments.length;
        const methodGroups = payments.reduce((acc, payment) => {
            if (!acc[payment.method]) {
                acc[payment.method] = { count: 0, totalAmount: 0 };
            }
            acc[payment.method].count++;
            acc[payment.method].totalAmount += Number(payment.amount);
            return acc;
        }, {});
        const paymentsByMethod = Object.entries(methodGroups).map(([method, data]) => ({
            method: method,
            count: data.count,
            totalAmount: data.totalAmount,
        }));
        const statusGroups = payments.reduce((acc, payment) => {
            if (!acc[payment.status]) {
                acc[payment.status] = { count: 0, totalAmount: 0 };
            }
            acc[payment.status].count++;
            acc[payment.status].totalAmount += Number(payment.amount);
            return acc;
        }, {});
        const paymentsByStatus = Object.entries(statusGroups).map(([status, data]) => ({
            status: status,
            count: data.count,
            totalAmount: data.totalAmount,
        }));
        return {
            totalAmount,
            totalPayments,
            paymentsByMethod,
            paymentsByStatus,
        };
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(1, (0, typeorm_1.InjectRepository)(student_fee_entity_1.StudentFee)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PaymentService);
//# sourceMappingURL=payment.service.js.map