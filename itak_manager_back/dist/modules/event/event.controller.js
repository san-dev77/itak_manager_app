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
exports.EventController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const event_service_1 = require("./event.service");
const event_dto_1 = require("./dto/event.dto");
const event_entity_1 = require("../../entities/event.entity");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let EventController = class EventController {
    eventService;
    constructor(eventService) {
        this.eventService = eventService;
    }
    async create(createEventDto) {
        return await this.eventService.create(createEventDto);
    }
    async findAll() {
        return await this.eventService.findAll();
    }
    async findByClass(classId, academicYearId) {
        return await this.eventService.findByClass(classId, academicYearId);
    }
    async findByDateRange(startDate, endDate, academicYearId, classId) {
        return await this.eventService.findByDateRange(startDate, endDate, academicYearId, classId);
    }
    async findByType(eventType, academicYearId, classId) {
        return await this.eventService.findByType(eventType, academicYearId, classId);
    }
    async getCalendarEvents(year, month, academicYearId, classId) {
        return await this.eventService.getCalendarEvents(year, month, academicYearId, classId);
    }
    async getUpcomingEvents(academicYearId, limit, classId) {
        return await this.eventService.getUpcomingEvents(academicYearId, limit || 10, classId);
    }
    async findOne(id) {
        return await this.eventService.findOne(id);
    }
    async update(id, updateEventDto) {
        return await this.eventService.update(id, updateEventDto);
    }
    async remove(id) {
        await this.eventService.remove(id);
        return { message: 'Événement supprimé avec succès' };
    }
};
exports.EventController = EventController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer un nouvel événement' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Événement créé avec succès',
        type: event_dto_1.EventResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Données invalides',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Utilisateur, classe ou année scolaire non trouvé(e)',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [event_dto_1.CreateEventDto]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer tous les événements' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Liste des événements',
        type: [event_dto_1.EventResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EventController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('class/:classId'),
    (0, swagger_1.ApiOperation)({ summary: "Récupérer les événements d'une classe" }),
    (0, swagger_1.ApiQuery)({
        name: 'academicYearId',
        required: true,
        description: "ID de l'année scolaire",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Événements de la classe',
        type: [event_dto_1.EventResponseDto],
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Classe non trouvée',
    }),
    __param(0, (0, common_1.Param)('classId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('academicYearId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "findByClass", null);
__decorate([
    (0, common_1.Get)('date-range'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer les événements dans une plage de dates' }),
    (0, swagger_1.ApiQuery)({
        name: 'startDate',
        required: true,
        description: 'Date de début (YYYY-MM-DD)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'endDate',
        required: true,
        description: 'Date de fin (YYYY-MM-DD)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'academicYearId',
        required: false,
        description: "ID de l'année scolaire",
    }),
    (0, swagger_1.ApiQuery)({
        name: 'classId',
        required: false,
        description: 'ID de la classe',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Événements dans la plage de dates',
        type: [event_dto_1.EventResponseDto],
    }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Query)('academicYearId')),
    __param(3, (0, common_1.Query)('classId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "findByDateRange", null);
__decorate([
    (0, common_1.Get)('type/:eventType'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer les événements par type' }),
    (0, swagger_1.ApiQuery)({
        name: 'academicYearId',
        required: true,
        description: "ID de l'année scolaire",
    }),
    (0, swagger_1.ApiQuery)({
        name: 'classId',
        required: false,
        description: 'ID de la classe',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Événements du type spécifié',
        type: [event_dto_1.EventResponseDto],
    }),
    __param(0, (0, common_1.Param)('eventType')),
    __param(1, (0, common_1.Query)('academicYearId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Query)('classId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "findByType", null);
__decorate([
    (0, common_1.Get)('calendar/:year/:month'),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer les événements pour un calendrier mensuel',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'academicYearId',
        required: false,
        description: "ID de l'année scolaire",
    }),
    (0, swagger_1.ApiQuery)({
        name: 'classId',
        required: false,
        description: 'ID de la classe',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Événements du calendrier mensuel',
        type: [event_dto_1.EventCalendarDto],
    }),
    __param(0, (0, common_1.Param)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('month', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('academicYearId')),
    __param(3, (0, common_1.Query)('classId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "getCalendarEvents", null);
__decorate([
    (0, common_1.Get)('upcoming'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer les événements à venir' }),
    (0, swagger_1.ApiQuery)({
        name: 'academicYearId',
        required: true,
        description: "ID de l'année scolaire",
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        description: "Nombre d'événements à retourner",
    }),
    (0, swagger_1.ApiQuery)({
        name: 'classId',
        required: false,
        description: 'ID de la classe',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Événements à venir',
        type: [event_dto_1.EventResponseDto],
    }),
    __param(0, (0, common_1.Query)('academicYearId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('limit', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('classId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "getUpcomingEvents", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer un événement par ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Événement trouvé',
        type: event_dto_1.EventResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Événement non trouvé',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour un événement' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Événement mis à jour avec succès',
        type: event_dto_1.EventResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Données invalides',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Événement non trouvé',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, event_dto_1.UpdateEventDto]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un événement' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Événement supprimé avec succès',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Événement non trouvé',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "remove", null);
exports.EventController = EventController = __decorate([
    (0, swagger_1.ApiTags)('events'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('events'),
    __metadata("design:paramtypes", [event_service_1.EventService])
], EventController);
//# sourceMappingURL=event.controller.js.map