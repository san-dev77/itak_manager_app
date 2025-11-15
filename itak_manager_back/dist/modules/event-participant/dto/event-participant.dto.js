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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateParticipantStatusDto = exports.BulkInviteParticipantsDto = exports.EventParticipantResponseDto = exports.UpdateEventParticipantDto = exports.CreateEventParticipantDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const event_participant_entity_1 = require("../../../entities/event-participant.entity");
class CreateEventParticipantDto {
    eventId;
    userId;
    role;
    status;
}
exports.CreateEventParticipantDto = CreateEventParticipantDto;
__decorate([
    (0, class_validator_1.IsUUID)('4', { message: 'eventId doit être un UUID valide' }),
    __metadata("design:type", String)
], CreateEventParticipantDto.prototype, "eventId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('4', { message: 'userId doit être un UUID valide' }),
    __metadata("design:type", String)
], CreateEventParticipantDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(event_participant_entity_1.ParticipantRole, {
        message: 'Le rôle du participant doit être valide',
    }),
    __metadata("design:type", String)
], CreateEventParticipantDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(event_participant_entity_1.ParticipantStatus, {
        message: 'Le statut du participant doit être valide',
    }),
    __metadata("design:type", String)
], CreateEventParticipantDto.prototype, "status", void 0);
class UpdateEventParticipantDto extends (0, swagger_1.PartialType)(CreateEventParticipantDto) {
}
exports.UpdateEventParticipantDto = UpdateEventParticipantDto;
class EventParticipantResponseDto {
    id;
    eventId;
    userId;
    role;
    status;
    event;
    user;
}
exports.EventParticipantResponseDto = EventParticipantResponseDto;
class BulkInviteParticipantsDto {
    eventId;
    participants;
}
exports.BulkInviteParticipantsDto = BulkInviteParticipantsDto;
__decorate([
    (0, class_validator_1.IsUUID)('4', { message: 'eventId doit être un UUID valide' }),
    __metadata("design:type", String)
], BulkInviteParticipantsDto.prototype, "eventId", void 0);
class UpdateParticipantStatusDto {
    status;
}
exports.UpdateParticipantStatusDto = UpdateParticipantStatusDto;
__decorate([
    (0, class_validator_1.IsEnum)(event_participant_entity_1.ParticipantStatus, {
        message: 'Le statut du participant doit être valide',
    }),
    __metadata("design:type", String)
], UpdateParticipantStatusDto.prototype, "status", void 0);
//# sourceMappingURL=event-participant.dto.js.map