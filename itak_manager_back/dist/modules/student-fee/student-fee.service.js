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
exports.StudentFeeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const student_fee_entity_1 = require("../../entities/student-fee.entity");
const student_entity_1 = require("../../entities/student.entity");
const fee_type_entity_1 = require("../../entities/fee-type.entity");
let StudentFeeService = class StudentFeeService {
    studentFeeRepository;
    studentRepository;
    feeTypeRepository;
    constructor(studentFeeRepository, studentRepository, feeTypeRepository) {
        this.studentFeeRepository = studentFeeRepository;
        this.studentRepository = studentRepository;
        this.feeTypeRepository = feeTypeRepository;
    }
    async create(createStudentFeeDto) {
        const student = await this.studentRepository.findOne({
            where: { id: createStudentFeeDto.studentId },
        });
        if (!student) {
            throw new common_1.NotFoundException(`Étudiant avec l'ID ${createStudentFeeDto.studentId} non trouvé`);
        }
        const feeType = await this.feeTypeRepository.findOne({
            where: { id: createStudentFeeDto.feeTypeId },
        });
        if (!feeType) {
            throw new common_1.NotFoundException(`Type de frais avec l'ID ${createStudentFeeDto.feeTypeId} non trouvé`);
        }
        const existingFee = await this.studentFeeRepository.findOne({
            where: {
                studentId: createStudentFeeDto.studentId,
                feeTypeId: createStudentFeeDto.feeTypeId,
                academicYearId: createStudentFeeDto.academicYearId,
            },
        });
        if (existingFee) {
            throw new common_1.ConflictException(`Des frais de type "${feeType.name}" existent déjà pour cet étudiant pour cette année scolaire`);
        }
        const studentFee = this.studentFeeRepository.create(createStudentFeeDto);
        return await this.studentFeeRepository.save(studentFee);
    }
    async findAll() {
        return await this.studentFeeRepository.find({
            relations: ['student', 'feeType', 'payments', 'academicYear'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const studentFee = await this.studentFeeRepository.findOne({
            where: { id },
            relations: ['student', 'feeType', 'payments', 'academicYear'],
        });
        if (!studentFee) {
            throw new common_1.NotFoundException(`Frais étudiant avec l'ID ${id} non trouvé`);
        }
        return studentFee;
    }
    async findByStudent(studentId) {
        const student = await this.studentRepository.findOne({
            where: { id: studentId },
        });
        if (!student) {
            throw new common_1.NotFoundException(`Étudiant avec l'ID ${studentId} non trouvé`);
        }
        return await this.studentFeeRepository.find({
            where: { studentId },
            relations: ['feeType', 'payments', 'academicYear'],
            order: { createdAt: 'DESC' },
        });
    }
    async getStudentFeesSummary(studentId) {
        const fees = await this.studentFeeRepository.find({
            where: { studentId },
            relations: ['feeType', 'payments'],
            order: { createdAt: 'DESC' },
        });
        const totalAssigned = fees.reduce((sum, fee) => sum + Number(fee.amountAssigned), 0);
        const totalPaid = fees.reduce((sum, fee) => sum + Number(fee.amountPaid), 0);
        const totalPending = fees
            .filter((fee) => fee.status === student_fee_entity_1.FeeStatus.PENDING || fee.status === student_fee_entity_1.FeeStatus.PARTIAL)
            .reduce((sum, fee) => sum + (Number(fee.amountAssigned) - Number(fee.amountPaid)), 0);
        const totalOverdue = fees
            .filter((fee) => fee.status === student_fee_entity_1.FeeStatus.OVERDUE)
            .reduce((sum, fee) => sum + (Number(fee.amountAssigned) - Number(fee.amountPaid)), 0);
        return {
            studentId,
            totalAssigned,
            totalPaid,
            totalPending,
            totalOverdue,
            fees,
        };
    }
    async update(id, updateStudentFeeDto) {
        const studentFee = await this.findOne(id);
        if (updateStudentFeeDto.studentId &&
            updateStudentFeeDto.studentId !== studentFee.studentId) {
            const student = await this.studentRepository.findOne({
                where: { id: updateStudentFeeDto.studentId },
            });
            if (!student) {
                throw new common_1.NotFoundException(`Étudiant avec l'ID ${updateStudentFeeDto.studentId} non trouvé`);
            }
        }
        if (updateStudentFeeDto.feeTypeId &&
            updateStudentFeeDto.feeTypeId !== studentFee.feeTypeId) {
            const feeType = await this.feeTypeRepository.findOne({
                where: { id: updateStudentFeeDto.feeTypeId },
            });
            if (!feeType) {
                throw new common_1.NotFoundException(`Type de frais avec l'ID ${updateStudentFeeDto.feeTypeId} non trouvé`);
            }
        }
        if ((updateStudentFeeDto.studentId &&
            updateStudentFeeDto.studentId !== studentFee.studentId) ||
            (updateStudentFeeDto.feeTypeId &&
                updateStudentFeeDto.feeTypeId !== studentFee.feeTypeId) ||
            (updateStudentFeeDto.academicYearId &&
                updateStudentFeeDto.academicYearId !== studentFee.academicYearId)) {
            const finalStudentId = updateStudentFeeDto.studentId || studentFee.studentId;
            const finalFeeTypeId = updateStudentFeeDto.feeTypeId || studentFee.feeTypeId;
            const finalAcademicYearId = updateStudentFeeDto.academicYearId || studentFee.academicYearId;
            const existingFee = await this.studentFeeRepository.findOne({
                where: {
                    studentId: finalStudentId,
                    feeTypeId: finalFeeTypeId,
                    academicYearId: finalAcademicYearId,
                },
            });
            if (existingFee && existingFee.id !== id) {
                throw new common_1.ConflictException(`Des frais de ce type existent déjà pour cet étudiant pour cette année scolaire`);
            }
        }
        Object.assign(studentFee, updateStudentFeeDto);
        const updatedFee = await this.studentFeeRepository.save(studentFee);
        return await this.findOne(updatedFee.id);
    }
    payFee(id, payStudentFeeDto) {
        throw new common_1.BadRequestException('Cette méthode est obsolète. Utilisez PaymentService.create() pour enregistrer un paiement.');
    }
    async remove(id) {
        const studentFee = await this.findOne(id);
        await this.studentFeeRepository.remove(studentFee);
    }
    async findOverdueFees() {
        const today = new Date();
        return await this.studentFeeRepository
            .createQueryBuilder('studentFee')
            .leftJoinAndSelect('studentFee.student', 'student')
            .leftJoinAndSelect('studentFee.feeType', 'feeType')
            .where('studentFee.dueDate < :today', { today })
            .andWhere('studentFee.status != :paidStatus', {
            paidStatus: student_fee_entity_1.FeeStatus.PAID,
        })
            .orderBy('studentFee.dueDate', 'ASC')
            .getMany();
    }
    async markOverdueFees() {
        const today = new Date();
        await this.studentFeeRepository
            .createQueryBuilder()
            .update(student_fee_entity_1.StudentFee)
            .set({ status: student_fee_entity_1.FeeStatus.OVERDUE })
            .where('dueDate < :today', { today })
            .andWhere('status != :paidStatus', { paidStatus: student_fee_entity_1.FeeStatus.PAID })
            .execute();
    }
};
exports.StudentFeeService = StudentFeeService;
exports.StudentFeeService = StudentFeeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(student_fee_entity_1.StudentFee)),
    __param(1, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __param(2, (0, typeorm_1.InjectRepository)(fee_type_entity_1.FeeType)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], StudentFeeService);
//# sourceMappingURL=student-fee.service.js.map