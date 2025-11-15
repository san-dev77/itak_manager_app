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
exports.EventParticipantController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const event_participant_service_1 = require("./event-participant.service");
const event_participant_dto_1 = require("./dto/event-participant.dto");
const event_participant_entity_1 = require("../../entities/event-participant.entity");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let EventParticipantController = class EventParticipantController {
    eventParticipantService;
    constructor(eventParticipantService) {
        this.eventParticipantService = eventParticipantService;
    }
    async create(createEventParticipantDto) {
        return await this.eventParticipantService.create(createEventParticipantDto);
    }
    async bulkInvite(bulkInviteDto) {
        return await this.eventParticipantService.bulkInvite(bulkInviteDto);
    }
    async findAll() {
        return await this.eventParticipantService.findAll();
    }
    async findByEvent(eventId) {
        return await this.eventParticipantService.findByEvent(eventId);
    }
    async findByUser(userId) {
        return await this.eventParticipantService.findByUser(userId);
    }
    async findByStatus(eventId, status) {
        return await this.eventParticipantService.findByStatus(eventId, status);
    }
    async getEventStatistics(eventId) {
        return await this.eventParticipantService.getEventStatistics(eventId);
    }
    async findOne(id) {
        return await this.eventParticipantService.findOne(id);
    }
    async updateStatus(id, updateStatusDto) {
        return await this.eventParticipantService.updateStatus(id, updateStatusDto);
    }
    async update(id, updateEventParticipantDto) {
        return await this.eventParticipantService.update(id, updateEventParticipantDto);
    }
    async remove(id) {
        await this.eventParticipantService.remove(id);
        return { message: 'Participant supprimé avec succès' };
    }
    async removeByEventAndUser(eventId, userId) {
        await this.eventParticipantService.removeByEventAndUser(eventId, userId);
        return { message: "Utilisateur retiré de l'événement avec succès" };
    }
};
exports.EventParticipantController = EventParticipantController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Ajouter un participant à un événement' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Participant ajouté avec succès',
        type: event_participant_dto_1.EventParticipantResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Événement ou utilisateur non trouvé',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Le participant existe déjà pour cet événement',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [event_participant_dto_1.CreateEventParticipantDto]),
    __metadata("design:returntype", Promise)
], EventParticipantController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('bulk-invite'),
    (0, swagger_1.ApiOperation)({ summary: 'Inviter plusieurs participants à un événement' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Participants invités avec succès',
        type: [event_participant_dto_1.EventParticipantResponseDto],
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Événement non trouvé',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [event_participant_dto_1.BulkInviteParticipantsDto]),
    __metadata("design:returntype", Promise)
], EventParticipantController.prototype, "bulkInvite", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer tous les participants aux événements' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Liste des participants',
        type: [event_participant_dto_1.EventParticipantResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EventParticipantController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('event/:eventId'),
    (0, swagger_1.ApiOperation)({ summary: "Récupérer les participants d'un événement" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Participants de l'événement",
        type: [event_participant_dto_1.EventParticipantResponseDto],
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Événement non trouvé',
    }),
    __param(0, (0, common_1.Param)('eventId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventParticipantController.prototype, "findByEvent", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: "Récupérer les événements d'un utilisateur" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Événements de l'utilisateur",
        type: [event_participant_dto_1.EventParticipantResponseDto],
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Utilisateur non trouvé',
    }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventParticipantController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Get)('event/:eventId/status/:status'),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer les participants par statut pour un événement',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Participants avec le statut spécifié',
        type: [event_participant_dto_1.EventParticipantResponseDto],
    }),
    __param(0, (0, common_1.Param)('eventId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EventParticipantController.prototype, "findByStatus", null);
__decorate([
    (0, common_1.Get)('event/:eventId/statistics'),
    (0, swagger_1.ApiOperation)({
        summary: "Récupérer les statistiques de participation d'un événement",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Statistiques de participation',
    }),
    __param(0, (0, common_1.Param)('eventId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventParticipantController.prototype, "getEventStatistics", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer un participant par ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Participant trouvé',
        type: event_participant_dto_1.EventParticipantResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Participant non trouvé',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventParticipantController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: "Mettre à jour le statut d'un participant" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Statut mis à jour avec succès',
        type: event_participant_dto_1.EventParticipantResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Participant non trouvé',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, event_participant_dto_1.UpdateParticipantStatusDto]),
    __metadata("design:returntype", Promise)
], EventParticipantController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour un participant' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Participant mis à jour avec succès',
        type: event_participant_dto_1.EventParticipantResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Participant non trouvé',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, event_participant_dto_1.UpdateEventParticipantDto]),
    __metadata("design:returntype", Promise)
], EventParticipantController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un participant' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Participant supprimé avec succès',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Participant non trouvé',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventParticipantController.prototype, "remove", null);
__decorate([
    (0, common_1.Delete)('event/:eventId/user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: "Retirer un utilisateur d'un événement" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Utilisateur retiré de l'événement avec succès",
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Participant non trouvé',
    }),
    __param(0, (0, common_1.Param)('eventId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EventParticipantController.prototype, "removeByEventAndUser", null);
exports.EventParticipantController = EventParticipantController = __decorate([
    (0, swagger_1.ApiTags)('event-participants'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('event-participants'),
    __metadata("design:paramtypes", [event_participant_service_1.EventParticipantService])
], EventParticipantController);
//# sourceMappingURL=event-participant.controller.js.map