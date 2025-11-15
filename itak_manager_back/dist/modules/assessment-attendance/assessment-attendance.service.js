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
exports.AssessmentAttendanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const assessment_attendance_entity_1 = require("../../entities/assessment-attendance.entity");
const assessment_entity_1 = require("../../entities/assessment.entity");
const student_entity_1 = require("../../entities/student.entity");
let AssessmentAttendanceService = class AssessmentAttendanceService {
    attendanceRepository;
    assessmentRepository;
    studentRepository;
    constructor(attendanceRepository, assessmentRepository, studentRepository) {
        this.attendanceRepository = attendanceRepository;
        this.assessmentRepository = assessmentRepository;
        this.studentRepository = studentRepository;
    }
    async create(createDto) {
        const assessment = await this.assessmentRepository.findOne({
            where: { id: createDto.assessmentId },
        });
        if (!assessment) {
            throw new common_1.NotFoundException(`Assessment with ID ${createDto.assessmentId} not found`);
        }
        const student = await this.studentRepository.findOne({
            where: { id: createDto.studentId },
        });
        if (!student) {
            throw new common_1.NotFoundException(`Student with ID ${createDto.studentId} not found`);
        }
        const existingAttendance = await this.attendanceRepository.findOne({
            where: {
                assessmentId: createDto.assessmentId,
                studentId: createDto.studentId,
            },
        });
        if (existingAttendance) {
            throw new common_1.ConflictException(`Attendance record already exists for student ${createDto.studentId} in assessment ${createDto.assessmentId}`);
        }
        const attendance = this.attendanceRepository.create({
            ...createDto,
            markedAt: createDto.markedBy ? new Date() : undefined,
        });
        const savedAttendance = await this.attendanceRepository.save(attendance);
        return this.mapToResponseDto(savedAttendance);
    }
    async bulkCreate(bulkDto) {
        const assessment = await this.assessmentRepository.findOne({
            where: { id: bulkDto.assessmentId },
        });
        if (!assessment) {
            throw new common_1.NotFoundException(`Assessment with ID ${bulkDto.assessmentId} not found`);
        }
        const studentIds = bulkDto.attendances.map((att) => att.studentId);
        const students = await this.studentRepository.findByIds(studentIds);
        if (students.length !== studentIds.length) {
            const foundIds = students.map((s) => s.id);
            const missingIds = studentIds.filter((id) => !foundIds.includes(id));
            throw new common_1.NotFoundException(`Students not found: ${missingIds.join(', ')}`);
        }
        const existingAttendances = await this.attendanceRepository.find({
            where: {
                assessmentId: bulkDto.assessmentId,
            },
        });
        const existingStudentIds = existingAttendances.map((att) => att.studentId);
        const duplicateIds = studentIds.filter((id) => existingStudentIds.includes(id));
        if (duplicateIds.length > 0) {
            throw new common_1.ConflictException(`Attendance records already exist for students: ${duplicateIds.join(', ')}`);
        }
        const attendanceRecords = bulkDto.attendances.map((attDto) => this.attendanceRepository.create({
            assessmentId: bulkDto.assessmentId,
            studentId: attDto.studentId,
            status: attDto.status,
            reason: attDto.reason,
            markedBy: bulkDto.markedBy,
            markedAt: bulkDto.markedBy ? new Date() : undefined,
        }));
        const savedAttendances = await this.attendanceRepository.save(attendanceRecords);
        return savedAttendances.map((attendance) => this.mapToResponseDto(attendance));
    }
    async findAll(filters) {
        const queryBuilder = this.attendanceRepository
            .createQueryBuilder('attendance')
            .leftJoinAndSelect('attendance.assessment', 'assessment')
            .leftJoinAndSelect('attendance.student', 'student')
            .leftJoinAndSelect('student.user', 'user')
            .orderBy('attendance.createdAt', 'DESC');
        if (filters?.assessmentId) {
            queryBuilder.andWhere('attendance.assessmentId = :assessmentId', {
                assessmentId: filters.assessmentId,
            });
        }
        if (filters?.studentId) {
            queryBuilder.andWhere('attendance.studentId = :studentId', {
                studentId: filters.studentId,
            });
        }
        if (filters?.status) {
            queryBuilder.andWhere('attendance.status = :status', {
                status: filters.status,
            });
        }
        const attendances = await queryBuilder.getMany();
        return attendances.map((attendance) => this.mapToResponseDto(attendance));
    }
    async findByAssessment(assessmentId) {
        return this.findAll({ assessmentId });
    }
    async findByStudent(studentId) {
        return this.findAll({ studentId });
    }
    async findOne(assessmentId, studentId) {
        const attendance = await this.attendanceRepository.findOne({
            where: { assessmentId, studentId },
            relations: ['assessment', 'student', 'student.user'],
        });
        if (!attendance) {
            throw new common_1.NotFoundException(`Attendance record not found for student ${studentId} in assessment ${assessmentId}`);
        }
        return this.mapToResponseDto(attendance);
    }
    async update(assessmentId, studentId, updateDto) {
        const attendance = await this.attendanceRepository.findOne({
            where: { assessmentId, studentId },
        });
        if (!attendance) {
            throw new common_1.NotFoundException(`Attendance record not found for student ${studentId} in assessment ${assessmentId}`);
        }
        if (updateDto.status && updateDto.status !== attendance.status) {
            updateDto.markedBy = updateDto.markedBy || attendance.markedBy;
            attendance.markedAt = new Date();
        }
        await this.attendanceRepository.update({ assessmentId, studentId }, { ...updateDto, markedAt: attendance.markedAt });
        const updatedAttendance = await this.attendanceRepository.findOne({
            where: { assessmentId, studentId },
            relations: ['assessment', 'student', 'student.user'],
        });
        return this.mapToResponseDto(updatedAttendance);
    }
    async remove(assessmentId, studentId) {
        const attendance = await this.attendanceRepository.findOne({
            where: { assessmentId, studentId },
        });
        if (!attendance) {
            throw new common_1.NotFoundException(`Attendance record not found for student ${studentId} in assessment ${assessmentId}`);
        }
        await this.attendanceRepository.remove(attendance);
    }
    async getAttendanceStats(assessmentId) {
        const attendances = await this.attendanceRepository.find({
            where: { assessmentId },
        });
        const total = attendances.length;
        const present = attendances.filter((att) => att.status === assessment_attendance_entity_1.AttendanceStatus.PRESENT).length;
        const absent = attendances.filter((att) => att.status === assessment_attendance_entity_1.AttendanceStatus.ABSENT).length;
        const excused = attendances.filter((att) => att.status === assessment_attendance_entity_1.AttendanceStatus.EXCUSED).length;
        const excluded = attendances.filter((att) => att.status === assessment_attendance_entity_1.AttendanceStatus.EXCLUDED).length;
        return {
            total,
            present,
            absent,
            excused,
            excluded,
            percentages: {
                present: total > 0 ? Math.round((present / total) * 100) : 0,
                absent: total > 0 ? Math.round((absent / total) * 100) : 0,
                excused: total > 0 ? Math.round((excused / total) * 100) : 0,
                excluded: total > 0 ? Math.round((excluded / total) * 100) : 0,
            },
        };
    }
    mapToResponseDto(attendance) {
        return {
            assessmentId: attendance.assessmentId,
            studentId: attendance.studentId,
            status: attendance.status,
            reason: attendance.reason,
            markedBy: attendance.markedBy,
            markedAt: attendance.markedAt,
            createdAt: attendance.createdAt,
            updatedAt: attendance.updatedAt,
            assessment: attendance.assessment
                ? {
                    id: attendance.assessment.id,
                    title: attendance.assessment.title,
                    type: attendance.assessment.type,
                    startDate: attendance.assessment.startDate,
                    endDate: attendance.assessment.endDate,
                }
                : undefined,
            student: attendance.student
                ? {
                    id: attendance.student.id,
                    matricule: attendance.student.matricule,
                    firstName: attendance.student.user?.firstName || '',
                    lastName: attendance.student.user?.lastName || '',
                }
                : undefined,
        };
    }
};
exports.AssessmentAttendanceService = AssessmentAttendanceService;
exports.AssessmentAttendanceService = AssessmentAttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(assessment_attendance_entity_1.AssessmentAttendance)),
    __param(1, (0, typeorm_1.InjectRepository)(assessment_entity_1.Assessment)),
    __param(2, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AssessmentAttendanceService);
//# sourceMappingURL=assessment-attendance.service.js.map