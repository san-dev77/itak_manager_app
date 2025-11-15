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
exports.EventService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const event_entity_1 = require("../../entities/event.entity");
const class_entity_1 = require("../../entities/class.entity");
const user_entity_1 = require("../../entities/user.entity");
const school_year_entity_1 = require("../../entities/school-year.entity");
let EventService = class EventService {
    eventRepository;
    classRepository;
    userRepository;
    schoolYearRepository;
    constructor(eventRepository, classRepository, userRepository, schoolYearRepository) {
        this.eventRepository = eventRepository;
        this.classRepository = classRepository;
        this.userRepository = userRepository;
        this.schoolYearRepository = schoolYearRepository;
    }
    async create(createEventDto) {
        const creator = await this.userRepository.findOne({
            where: { id: createEventDto.createdBy },
        });
        if (!creator) {
            throw new common_1.NotFoundException(`Utilisateur avec l'ID ${createEventDto.createdBy} non trouvé`);
        }
        const academicYear = await this.schoolYearRepository.findOne({
            where: { id: createEventDto.academicYearId },
        });
        if (!academicYear) {
            throw new common_1.NotFoundException(`Année scolaire avec l'ID ${createEventDto.academicYearId} non trouvée`);
        }
        if (createEventDto.classId) {
            const classEntity = await this.classRepository.findOne({
                where: { id: createEventDto.classId },
            });
            if (!classEntity) {
                throw new common_1.NotFoundException(`Classe avec l'ID ${createEventDto.classId} non trouvée`);
            }
        }
        if (createEventDto.endDate &&
            createEventDto.startDate >= createEventDto.endDate) {
            throw new common_1.BadRequestException('La date de début doit être antérieure à la date de fin');
        }
        const event = this.eventRepository.create(createEventDto);
        return await this.eventRepository.save(event);
    }
    async findAll() {
        return await this.eventRepository.find({
            relations: ['class', 'creator', 'academicYear', 'participants'],
            order: { startDate: 'DESC' },
        });
    }
    async findOne(id) {
        const event = await this.eventRepository.findOne({
            where: { id },
            relations: ['class', 'creator', 'academicYear', 'participants'],
        });
        if (!event) {
            throw new common_1.NotFoundException(`Événement avec l'ID ${id} non trouvé`);
        }
        return event;
    }
    async findByClass(classId, academicYearId) {
        const classEntity = await this.classRepository.findOne({
            where: { id: classId },
        });
        if (!classEntity) {
            throw new common_1.NotFoundException(`Classe avec l'ID ${classId} non trouvée`);
        }
        return await this.eventRepository.find({
            where: { classId, academicYearId },
            relations: ['creator', 'participants'],
            order: { startDate: 'ASC' },
        });
    }
    async findByDateRange(startDate, endDate, academicYearId, classId) {
        const query = this.eventRepository
            .createQueryBuilder('event')
            .leftJoinAndSelect('event.class', 'class')
            .leftJoinAndSelect('event.creator', 'creator')
            .leftJoinAndSelect('event.academicYear', 'academicYear')
            .where('event.startDate BETWEEN :startDate AND :endDate', {
            startDate,
            endDate,
        });
        if (academicYearId) {
            query.andWhere('event.academicYearId = :academicYearId', {
                academicYearId,
            });
        }
        if (classId) {
            query.andWhere('event.classId = :classId', { classId });
        }
        return await query.orderBy('event.startDate', 'ASC').getMany();
    }
    async findByType(eventType, academicYearId, classId) {
        const query = this.eventRepository
            .createQueryBuilder('event')
            .leftJoinAndSelect('event.class', 'class')
            .leftJoinAndSelect('event.creator', 'creator')
            .where('event.eventType = :eventType', { eventType })
            .andWhere('event.academicYearId = :academicYearId', { academicYearId });
        if (classId) {
            query.andWhere('event.classId = :classId', { classId });
        }
        return await query.orderBy('event.startDate', 'ASC').getMany();
    }
    async getCalendarEvents(year, month, academicYearId, classId) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const events = await this.findByDateRange(startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0], academicYearId, classId);
        const calendarData = {};
        events.forEach((event) => {
            const eventDate = new Date(event.startDate).toISOString().split('T')[0];
            if (!calendarData[eventDate]) {
                calendarData[eventDate] = {
                    date: eventDate,
                    events: [],
                };
            }
            calendarData[eventDate].events.push({
                id: event.id,
                title: event.title,
                eventType: event.eventType,
                startDate: event.startDate.toString(),
                endDate: event.endDate?.toString(),
                allDay: event.allDay,
                className: event.class?.name,
            });
        });
        return Object.values(calendarData).sort((a, b) => a.date.localeCompare(b.date));
    }
    async getUpcomingEvents(academicYearId, limit = 10, classId) {
        const today = new Date().toISOString().split('T')[0];
        const query = this.eventRepository
            .createQueryBuilder('event')
            .leftJoinAndSelect('event.class', 'class')
            .leftJoinAndSelect('event.creator', 'creator')
            .where('event.startDate >= :today', { today })
            .andWhere('event.academicYearId = :academicYearId', { academicYearId });
        if (classId) {
            query.andWhere('event.classId = :classId', { classId });
        }
        return await query.orderBy('event.startDate', 'ASC').limit(limit).getMany();
    }
    async update(id, updateEventDto) {
        const event = await this.findOne(id);
        const startDate = updateEventDto.startDate || event.startDate.toISOString().split('T')[0];
        const endDate = updateEventDto.endDate ||
            (event.endDate ? event.endDate.toISOString().split('T')[0] : undefined);
        if (endDate && startDate >= endDate) {
            throw new common_1.BadRequestException('La date de début doit être antérieure à la date de fin');
        }
        Object.assign(event, updateEventDto);
        return await this.eventRepository.save(event);
    }
    async remove(id) {
        const event = await this.findOne(id);
        await this.eventRepository.remove(event);
    }
};
exports.EventService = EventService;
exports.EventService = EventService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(event_entity_1.Event)),
    __param(1, (0, typeorm_1.InjectRepository)(class_entity_1.Class)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(school_year_entity_1.SchoolYear)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], EventService);
//# sourceMappingURL=event.service.js.map