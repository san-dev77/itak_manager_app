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
exports.StudentTransferService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const student_transfer_entity_1 = require("../../entities/student-transfer.entity");
const student_class_entity_1 = require("../../entities/student-class.entity");
const student_entity_1 = require("../../entities/student.entity");
const class_entity_1 = require("../../entities/class.entity");
let StudentTransferService = class StudentTransferService {
    studentTransferRepository;
    studentClassRepository;
    studentRepository;
    classRepository;
    constructor(studentTransferRepository, studentClassRepository, studentRepository, classRepository) {
        this.studentTransferRepository = studentTransferRepository;
        this.studentClassRepository = studentClassRepository;
        this.studentRepository = studentRepository;
        this.classRepository = classRepository;
    }
    async create(createDto) {
        const student = await this.studentRepository.findOne({
            where: { id: createDto.studentId },
        });
        if (!student) {
            throw new common_1.NotFoundException(`Student with ID ${createDto.studentId} not found`);
        }
        const [fromClass, toClass] = await Promise.all([
            this.classRepository.findOne({ where: { id: createDto.fromClassId } }),
            this.classRepository.findOne({ where: { id: createDto.toClassId } }),
        ]);
        if (!fromClass) {
            throw new common_1.NotFoundException(`From class with ID ${createDto.fromClassId} not found`);
        }
        if (!toClass) {
            throw new common_1.NotFoundException(`To class with ID ${createDto.toClassId} not found`);
        }
        const currentStudentClass = await this.studentClassRepository.findOne({
            where: {
                studentId: createDto.studentId,
                classId: createDto.fromClassId,
                status: student_class_entity_1.StudentClassStatus.ACTIVE,
                year: createDto.year,
            },
        });
        if (!currentStudentClass) {
            throw new common_1.BadRequestException(`Student is not currently active in the from class for year ${createDto.year}`);
        }
        const existingToClass = await this.studentClassRepository.findOne({
            where: {
                studentId: createDto.studentId,
                classId: createDto.toClassId,
                status: student_class_entity_1.StudentClassStatus.ACTIVE,
                year: createDto.year,
            },
        });
        if (existingToClass) {
            throw new common_1.ConflictException(`Student is already active in the to class for year ${createDto.year}`);
        }
        const toClassStudentCount = await this.studentClassRepository.count({
            where: {
                classId: createDto.toClassId,
                status: student_class_entity_1.StudentClassStatus.ACTIVE,
                year: createDto.year,
            },
        });
        if (toClass.capacity && toClassStudentCount >= toClass.capacity) {
            throw new common_1.BadRequestException(`Target class has reached its capacity of ${toClass.capacity} students`);
        }
        const transfer = this.studentTransferRepository.create({
            ...createDto,
            transferDate: new Date(createDto.transferDate),
            approvalDate: createDto.approvedBy ? new Date() : undefined,
        });
        const savedTransfer = await this.studentTransferRepository.save(transfer);
        await this.executeTransfer(savedTransfer.id);
        return this.mapToResponseDto(savedTransfer);
    }
    async executeTransfer(transferId) {
        const transfer = await this.studentTransferRepository.findOne({
            where: { id: transferId },
        });
        if (!transfer) {
            throw new common_1.NotFoundException(`Transfer with ID ${transferId} not found`);
        }
        await this.studentClassRepository.update({
            studentId: transfer.studentId,
            classId: transfer.fromClassId,
            status: student_class_entity_1.StudentClassStatus.ACTIVE,
            year: transfer.year,
        }, {
            status: student_class_entity_1.StudentClassStatus.TRANSFERRED,
            endDate: transfer.transferDate,
        });
        const newStudentClass = this.studentClassRepository.create({
            studentId: transfer.studentId,
            classId: transfer.toClassId,
            startDate: transfer.transferDate,
            status: student_class_entity_1.StudentClassStatus.ACTIVE,
            year: transfer.year,
        });
        await this.studentClassRepository.save(newStudentClass);
    }
    async findAll(filters) {
        const queryBuilder = this.studentTransferRepository
            .createQueryBuilder('transfer')
            .leftJoinAndSelect('transfer.student', 'student')
            .leftJoinAndSelect('transfer.fromClass', 'fromClass')
            .leftJoinAndSelect('transfer.toClass', 'toClass')
            .orderBy('transfer.transferDate', 'DESC');
        if (filters?.studentId) {
            queryBuilder.andWhere('transfer.studentId = :studentId', {
                studentId: filters.studentId,
            });
        }
        if (filters?.year) {
            queryBuilder.andWhere('transfer.year = :year', { year: filters.year });
        }
        if (filters?.reason) {
            queryBuilder.andWhere('transfer.reason = :reason', {
                reason: filters.reason,
            });
        }
        if (filters?.fromClassId) {
            queryBuilder.andWhere('transfer.fromClassId = :fromClassId', {
                fromClassId: filters.fromClassId,
            });
        }
        if (filters?.toClassId) {
            queryBuilder.andWhere('transfer.toClassId = :toClassId', {
                toClassId: filters.toClassId,
            });
        }
        const transfers = await queryBuilder.getMany();
        return transfers.map((transfer) => this.mapToResponseDto(transfer));
    }
    async findOne(id) {
        const transfer = await this.studentTransferRepository.findOne({
            where: { id },
            relations: ['student', 'fromClass', 'toClass'],
        });
        if (!transfer) {
            throw new common_1.NotFoundException(`Transfer with ID ${id} not found`);
        }
        return this.mapToResponseDto(transfer);
    }
    async update(id, updateDto) {
        const transfer = await this.studentTransferRepository.findOne({
            where: { id },
        });
        if (!transfer) {
            throw new common_1.NotFoundException(`Transfer with ID ${id} not found`);
        }
        if (updateDto.approvedBy && !transfer.approvedBy) {
            updateDto.approvalDate = new Date().toISOString();
        }
        await this.studentTransferRepository.update(id, {
            ...updateDto,
            approvalDate: updateDto.approvalDate
                ? new Date(updateDto.approvalDate)
                : undefined,
        });
        const updatedTransfer = await this.studentTransferRepository.findOne({
            where: { id },
            relations: ['student', 'fromClass', 'toClass'],
        });
        return this.mapToResponseDto(updatedTransfer);
    }
    async remove(id) {
        const transfer = await this.studentTransferRepository.findOne({
            where: { id },
        });
        if (!transfer) {
            throw new common_1.NotFoundException(`Transfer with ID ${id} not found`);
        }
        await this.reverseTransfer(id);
        await this.studentTransferRepository.remove(transfer);
    }
    async reverseTransfer(transferId) {
        const transfer = await this.studentTransferRepository.findOne({
            where: { id: transferId },
        });
        if (!transfer) {
            throw new common_1.NotFoundException(`Transfer with ID ${transferId} not found`);
        }
        await this.studentClassRepository.update({
            studentId: transfer.studentId,
            classId: transfer.fromClassId,
            year: transfer.year,
        }, {
            status: student_class_entity_1.StudentClassStatus.ACTIVE,
            endDate: undefined,
        });
        await this.studentClassRepository.delete({
            studentId: transfer.studentId,
            classId: transfer.toClassId,
            year: transfer.year,
            startDate: transfer.transferDate,
        });
    }
    async updateStudentClassStatus(studentId, classId, year, updateDto) {
        const studentClass = await this.studentClassRepository.findOne({
            where: { studentId, classId, year },
        });
        if (!studentClass) {
            throw new common_1.NotFoundException(`Student class record not found for student ${studentId} in class ${classId} for year ${year}`);
        }
        await this.studentClassRepository.update({ studentId, classId, year }, { status: updateDto.status });
    }
    mapToResponseDto(transfer) {
        return {
            id: transfer.id,
            studentId: transfer.studentId,
            fromClassId: transfer.fromClassId,
            toClassId: transfer.toClassId,
            transferDate: transfer.transferDate,
            reason: transfer.reason,
            reasonDetails: transfer.reasonDetails,
            year: transfer.year,
            approvedBy: transfer.approvedBy,
            approvalDate: transfer.approvalDate,
            createdAt: transfer.createdAt,
            updatedAt: transfer.updatedAt,
            student: transfer.student
                ? {
                    id: transfer.student.id,
                    firstName: transfer.student.user?.firstName || '',
                    lastName: transfer.student.user?.lastName || '',
                    studentNumber: transfer.student.matricule,
                }
                : undefined,
            fromClass: transfer.fromClass
                ? {
                    id: transfer.fromClass.id,
                    name: transfer.fromClass.name,
                    code: transfer.fromClass.code,
                    level: transfer.fromClass.level,
                }
                : undefined,
            toClass: transfer.toClass
                ? {
                    id: transfer.toClass.id,
                    name: transfer.toClass.name,
                    code: transfer.toClass.code,
                    level: transfer.toClass.level,
                }
                : undefined,
        };
    }
};
exports.StudentTransferService = StudentTransferService;
exports.StudentTransferService = StudentTransferService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(student_transfer_entity_1.StudentTransfer)),
    __param(1, (0, typeorm_1.InjectRepository)(student_class_entity_1.StudentClass)),
    __param(2, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __param(3, (0, typeorm_1.InjectRepository)(class_entity_1.Class)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], StudentTransferService);
//# sourceMappingURL=student-transfer.service.js.map