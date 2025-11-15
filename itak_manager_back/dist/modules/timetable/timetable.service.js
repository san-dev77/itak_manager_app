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
exports.TimetableService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const timetable_entity_1 = require("../../entities/timetable.entity");
const teaching_assignment_entity_1 = require("../../entities/teaching-assignment.entity");
const school_year_entity_1 = require("../../entities/school-year.entity");
const class_entity_1 = require("../../entities/class.entity");
const user_entity_1 = require("../../entities/user.entity");
let TimetableService = class TimetableService {
    timetableRepository;
    teachingAssignmentRepository;
    schoolYearRepository;
    classRepository;
    userRepository;
    constructor(timetableRepository, teachingAssignmentRepository, schoolYearRepository, classRepository, userRepository) {
        this.timetableRepository = timetableRepository;
        this.teachingAssignmentRepository = teachingAssignmentRepository;
        this.schoolYearRepository = schoolYearRepository;
        this.classRepository = classRepository;
        this.userRepository = userRepository;
    }
    async create(createTimetableDto) {
        const teachingAssignment = await this.teachingAssignmentRepository.findOne({
            where: { id: createTimetableDto.teachingAssignmentId },
            relations: [
                'teacher',
                'teacher.user',
                'classSubject',
                'classSubject.class',
                'classSubject.subject',
            ],
        });
        if (!teachingAssignment) {
            throw new common_1.NotFoundException(`Affectation d'enseignement avec l'ID ${createTimetableDto.teachingAssignmentId} non trouvée`);
        }
        const academicYear = await this.schoolYearRepository.findOne({
            where: { id: createTimetableDto.academicYearId },
        });
        if (!academicYear) {
            throw new common_1.NotFoundException(`Année scolaire avec l'ID ${createTimetableDto.academicYearId} non trouvée`);
        }
        if (createTimetableDto.startTime >= createTimetableDto.endTime) {
            throw new common_1.BadRequestException("L'heure de début doit être antérieure à l'heure de fin");
        }
        await this.checkClassTimeConflict(teachingAssignment.classSubject.class.id, createTimetableDto.academicYearId, createTimetableDto.dayOfWeek, createTimetableDto.startTime, createTimetableDto.endTime);
        const teacherConflict = await this.checkTeacherTimeConflict(teachingAssignment.teacher.id, createTimetableDto.academicYearId, createTimetableDto.dayOfWeek, createTimetableDto.startTime, createTimetableDto.endTime);
        if (teacherConflict) {
            throw new common_1.ConflictException(`Conflit d'horaire pour l'enseignant ${teachingAssignment.teacher.user.firstName} ${teachingAssignment.teacher.user.lastName} le ${createTimetableDto.dayOfWeek} de ${createTimetableDto.startTime} à ${createTimetableDto.endTime}`);
        }
        const timetable = this.timetableRepository.create(createTimetableDto);
        return await this.timetableRepository.save(timetable);
    }
    async findAll() {
        return await this.timetableRepository.find({
            relations: [
                'teachingAssignment',
                'teachingAssignment.teacher',
                'teachingAssignment.teacher.user',
                'teachingAssignment.classSubject',
                'teachingAssignment.classSubject.class',
                'teachingAssignment.classSubject.subject',
                'academicYear',
            ],
            order: { dayOfWeek: 'ASC', startTime: 'ASC' },
        });
    }
    async findOne(id) {
        const timetable = await this.timetableRepository.findOne({
            where: { id },
            relations: [
                'teachingAssignment',
                'teachingAssignment.teacher',
                'teachingAssignment.teacher.user',
                'teachingAssignment.classSubject',
                'teachingAssignment.classSubject.class',
                'teachingAssignment.classSubject.subject',
                'academicYear',
            ],
        });
        if (!timetable) {
            throw new common_1.NotFoundException(`Emploi du temps avec l'ID ${id} non trouvé`);
        }
        return timetable;
    }
    async findByClass(classId, academicYearId) {
        const classEntity = await this.classRepository.findOne({
            where: { id: classId },
        });
        if (!classEntity) {
            throw new common_1.NotFoundException(`Classe avec l'ID ${classId} non trouvée`);
        }
        return await this.timetableRepository
            .createQueryBuilder('timetable')
            .leftJoinAndSelect('timetable.teachingAssignment', 'teachingAssignment')
            .leftJoinAndSelect('teachingAssignment.teacher', 'teacher')
            .leftJoinAndSelect('teacher.user', 'user')
            .leftJoinAndSelect('teachingAssignment.classSubject', 'classSubject')
            .leftJoinAndSelect('classSubject.class', 'class')
            .leftJoinAndSelect('classSubject.subject', 'subject')
            .where('class.id = :classId', { classId })
            .andWhere('timetable.academicYearId = :academicYearId', {
            academicYearId,
        })
            .orderBy('timetable.dayOfWeek', 'ASC')
            .addOrderBy('timetable.startTime', 'ASC')
            .getMany();
    }
    async findByTeacher(teacherId, academicYearId) {
        const teacher = await this.userRepository.findOne({
            where: { id: teacherId },
        });
        if (!teacher) {
            throw new common_1.NotFoundException(`Enseignant avec l'ID ${teacherId} non trouvé`);
        }
        return await this.timetableRepository
            .createQueryBuilder('timetable')
            .leftJoinAndSelect('timetable.teachingAssignment', 'teachingAssignment')
            .leftJoinAndSelect('teachingAssignment.teacher', 'teacher')
            .leftJoinAndSelect('teacher.user', 'user')
            .leftJoinAndSelect('teachingAssignment.classSubject', 'classSubject')
            .leftJoinAndSelect('classSubject.class', 'class')
            .leftJoinAndSelect('classSubject.subject', 'subject')
            .where('teacher.id = :teacherId', { teacherId })
            .andWhere('timetable.academicYearId = :academicYearId', {
            academicYearId,
        })
            .orderBy('timetable.dayOfWeek', 'ASC')
            .addOrderBy('timetable.startTime', 'ASC')
            .getMany();
    }
    async getWeeklyTimetable(classId, academicYearId) {
        const classEntity = await this.classRepository.findOne({
            where: { id: classId },
        });
        if (!classEntity) {
            throw new common_1.NotFoundException(`Classe avec l'ID ${classId} non trouvée`);
        }
        const timetables = await this.findByClass(classId, academicYearId);
        const schedule = {};
        timetables.forEach((timetable) => {
            if (!schedule[timetable.dayOfWeek]) {
                schedule[timetable.dayOfWeek] = [];
            }
            schedule[timetable.dayOfWeek].push({
                id: timetable.id,
                startTime: timetable.startTime,
                endTime: timetable.endTime,
                subject: timetable.teachingAssignment.classSubject.subject.name,
                teacher: `${timetable.teachingAssignment.teacher.user.firstName} ${timetable.teachingAssignment.teacher.user.lastName}`,
                room: timetable.room,
                teachingAssignmentId: timetable.teachingAssignmentId,
            });
        });
        return {
            classId,
            className: classEntity.name,
            academicYearId,
            schedule,
        };
    }
    async update(id, updateTimetableDto) {
        const timetable = await this.findOne(id);
        const startTime = updateTimetableDto.startTime || timetable.startTime;
        const endTime = updateTimetableDto.endTime || timetable.endTime;
        if (startTime >= endTime) {
            throw new common_1.BadRequestException("L'heure de début doit être antérieure à l'heure de fin");
        }
        Object.assign(timetable, updateTimetableDto);
        return await this.timetableRepository.save(timetable);
    }
    async remove(id) {
        const timetable = await this.findOne(id);
        await this.timetableRepository.remove(timetable);
    }
    async checkClassTimeConflict(classId, academicYearId, dayOfWeek, startTime, endTime, excludeId) {
        const query = this.timetableRepository
            .createQueryBuilder('timetable')
            .leftJoin('timetable.teachingAssignment', 'teachingAssignment')
            .leftJoin('teachingAssignment.classSubject', 'classSubject')
            .leftJoin('classSubject.class', 'class')
            .where('class.id = :classId', { classId })
            .andWhere('timetable.academicYearId = :academicYearId', {
            academicYearId,
        })
            .andWhere('timetable.dayOfWeek = :dayOfWeek', { dayOfWeek })
            .andWhere('(timetable.startTime < :endTime AND timetable.endTime > :startTime)', { startTime, endTime });
        if (excludeId) {
            query.andWhere('timetable.id != :excludeId', { excludeId });
        }
        const conflict = await query.getOne();
        return !!conflict;
    }
    async checkTeacherTimeConflict(teacherId, academicYearId, dayOfWeek, startTime, endTime, excludeId) {
        const query = this.timetableRepository
            .createQueryBuilder('timetable')
            .leftJoin('timetable.teachingAssignment', 'teachingAssignment')
            .leftJoin('teachingAssignment.teacher', 'teacher')
            .where('teacher.id = :teacherId', { teacherId })
            .andWhere('timetable.academicYearId = :academicYearId', {
            academicYearId,
        })
            .andWhere('timetable.dayOfWeek = :dayOfWeek', { dayOfWeek })
            .andWhere('(timetable.startTime < :endTime AND timetable.endTime > :startTime)', { startTime, endTime });
        if (excludeId) {
            query.andWhere('timetable.id != :excludeId', { excludeId });
        }
        const conflict = await query.getOne();
        return !!conflict;
    }
};
exports.TimetableService = TimetableService;
exports.TimetableService = TimetableService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(timetable_entity_1.Timetable)),
    __param(1, (0, typeorm_1.InjectRepository)(teaching_assignment_entity_1.TeachingAssignment)),
    __param(2, (0, typeorm_1.InjectRepository)(school_year_entity_1.SchoolYear)),
    __param(3, (0, typeorm_1.InjectRepository)(class_entity_1.Class)),
    __param(4, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TimetableService);
//# sourceMappingURL=timetable.service.js.map