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
exports.EventCalendarDto = exports.EventResponseDto = exports.UpdateEventDto = exports.CreateEventDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const event_entity_1 = require("../../../entities/event.entity");
class CreateEventDto {
    title;
    description;
    eventType;
    startDate;
    endDate;
    allDay;
    classId;
    createdBy;
    academicYearId;
}
exports.CreateEventDto = CreateEventDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Le titre doit être une chaîne' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Le titre ne peut pas dépasser 100 caractères' }),
    __metadata("design:type", String)
], CreateEventDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'La description doit être une chaîne' }),
    __metadata("design:type", String)
], CreateEventDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(event_entity_1.EventType, { message: "Le type d'événement doit être valide" }),
    __metadata("design:type", String)
], CreateEventDto.prototype, "eventType", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'La date de début doit être valide' }),
    __metadata("design:type", String)
], CreateEventDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'La date de fin doit être valide' }),
    __metadata("design:type", String)
], CreateEventDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'allDay doit être un booléen' }),
    __metadata("design:type", Boolean)
], CreateEventDto.prototype, "allDay", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'classId doit être un UUID valide' }),
    __metadata("design:type", String)
], CreateEventDto.prototype, "classId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('4', { message: 'createdBy doit être un UUID valide' }),
    __metadata("design:type", String)
], CreateEventDto.prototype, "createdBy", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('4', { message: 'academicYearId doit être un UUID valide' }),
    __metadata("design:type", String)
], CreateEventDto.prototype, "academicYearId", void 0);
class UpdateEventDto extends (0, swagger_1.PartialType)(CreateEventDto) {
}
exports.UpdateEventDto = UpdateEventDto;
class EventResponseDto {
    id;
    title;
    description;
    eventType;
    startDate;
    endDate;
    allDay;
    classId;
    createdBy;
    academicYearId;
    createdAt;
    updatedAt;
    class;
    creator;
    academicYear;
    participants;
}
exports.EventResponseDto = EventResponseDto;
class EventCalendarDto {
    date;
    events;
}
exports.EventCalendarDto = EventCalendarDto;
//# sourceMappingURL=event.dto.js.map