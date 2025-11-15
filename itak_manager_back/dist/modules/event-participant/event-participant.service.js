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
exports.EventParticipantService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const event_participant_entity_1 = require("../../entities/event-participant.entity");
const event_entity_1 = require("../../entities/event.entity");
const user_entity_1 = require("../../entities/user.entity");
let EventParticipantService = class EventParticipantService {
    eventParticipantRepository;
    eventRepository;
    userRepository;
    constructor(eventParticipantRepository, eventRepository, userRepository) {
        this.eventParticipantRepository = eventParticipantRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }
    async create(createEventParticipantDto) {
        const event = await this.eventRepository.findOne({
            where: { id: createEventParticipantDto.eventId },
        });
        if (!event) {
            throw new common_1.NotFoundException(`Événement avec l'ID ${createEventParticipantDto.eventId} non trouvé`);
        }
        const user = await this.userRepository.findOne({
            where: { id: createEventParticipantDto.userId },
        });
        if (!user) {
            throw new common_1.NotFoundException(`Utilisateur avec l'ID ${createEventParticipantDto.userId} non trouvé`);
        }
        const existingParticipant = await this.eventParticipantRepository.findOne({
            where: {
                eventId: createEventParticipantDto.eventId,
                userId: createEventParticipantDto.userId,
            },
        });
        if (existingParticipant) {
            throw new common_1.ConflictException(`L'utilisateur ${user.firstName} ${user.lastName} participe déjà à cet événement`);
        }
        const participant = this.eventParticipantRepository.create({
            ...createEventParticipantDto,
            status: createEventParticipantDto.status || event_participant_entity_1.ParticipantStatus.INVITED,
        });
        return await this.eventParticipantRepository.save(participant);
    }
    async bulkInvite(bulkInviteDto) {
        const event = await this.eventRepository.findOne({
            where: { id: bulkInviteDto.eventId },
        });
        if (!event) {
            throw new common_1.NotFoundException(`Événement avec l'ID ${bulkInviteDto.eventId} non trouvé`);
        }
        const participants = [];
        for (const participantData of bulkInviteDto.participants) {
            const user = await this.userRepository.findOne({
                where: { id: participantData.userId },
            });
            if (!user) {
                continue;
            }
            const existingParticipant = await this.eventParticipantRepository.findOne({
                where: {
                    eventId: bulkInviteDto.eventId,
                    userId: participantData.userId,
                },
            });
            if (existingParticipant) {
                continue;
            }
            const participant = this.eventParticipantRepository.create({
                eventId: bulkInviteDto.eventId,
                userId: participantData.userId,
                role: participantData.role,
                status: event_participant_entity_1.ParticipantStatus.INVITED,
            });
            participants.push(await this.eventParticipantRepository.save(participant));
        }
        return participants;
    }
    async findAll() {
        return await this.eventParticipantRepository.find({
            relations: ['event', 'user'],
            order: { event: { startDate: 'DESC' } },
        });
    }
    async findOne(id) {
        const participant = await this.eventParticipantRepository.findOne({
            where: { id },
            relations: ['event', 'user'],
        });
        if (!participant) {
            throw new common_1.NotFoundException(`Participant avec l'ID ${id} non trouvé`);
        }
        return participant;
    }
    async findByEvent(eventId) {
        const event = await this.eventRepository.findOne({
            where: { id: eventId },
        });
        if (!event) {
            throw new common_1.NotFoundException(`Événement avec l'ID ${eventId} non trouvé`);
        }
        return await this.eventParticipantRepository.find({
            where: { eventId },
            relations: ['user'],
            order: { role: 'ASC', user: { lastName: 'ASC' } },
        });
    }
    async findByUser(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé`);
        }
        return await this.eventParticipantRepository.find({
            where: { userId },
            relations: ['event'],
            order: { event: { startDate: 'DESC' } },
        });
    }
    async findByStatus(eventId, status) {
        return await this.eventParticipantRepository.find({
            where: { eventId, status },
            relations: ['user'],
            order: { user: { lastName: 'ASC' } },
        });
    }
    async updateStatus(id, updateStatusDto) {
        const participant = await this.findOne(id);
        participant.status = updateStatusDto.status;
        return await this.eventParticipantRepository.save(participant);
    }
    async update(id, updateEventParticipantDto) {
        const participant = await this.findOne(id);
        Object.assign(participant, updateEventParticipantDto);
        return await this.eventParticipantRepository.save(participant);
    }
    async remove(id) {
        const participant = await this.findOne(id);
        await this.eventParticipantRepository.remove(participant);
    }
    async removeByEventAndUser(eventId, userId) {
        const participant = await this.eventParticipantRepository.findOne({
            where: { eventId, userId },
        });
        if (!participant) {
            throw new common_1.NotFoundException(`Participant non trouvé pour l'événement ${eventId} et l'utilisateur ${userId}`);
        }
        await this.eventParticipantRepository.remove(participant);
    }
    async getEventStatistics(eventId) {
        const participants = await this.findByEvent(eventId);
        return {
            total: participants.length,
            invited: participants.filter((p) => p.status === event_participant_entity_1.ParticipantStatus.INVITED).length,
            confirmed: participants.filter((p) => p.status === event_participant_entity_1.ParticipantStatus.CONFIRMED).length,
            declined: participants.filter((p) => p.status === event_participant_entity_1.ParticipantStatus.DECLINED).length,
            absent: participants.filter((p) => p.status === event_participant_entity_1.ParticipantStatus.ABSENT)
                .length,
        };
    }
};
exports.EventParticipantService = EventParticipantService;
exports.EventParticipantService = EventParticipantService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(event_participant_entity_1.EventParticipant)),
    __param(1, (0, typeorm_1.InjectRepository)(event_entity_1.Event)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], EventParticipantService);
//# sourceMappingURL=event-participant.service.js.map