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
exports.WeeklyTimetableDto = exports.TimetableResponseDto = exports.UpdateTimetableDto = exports.CreateTimetableDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const timetable_entity_1 = require("../../../entities/timetable.entity");
class CreateTimetableDto {
    teachingAssignmentId;
    academicYearId;
    dayOfWeek;
    startTime;
    endTime;
    room;
}
exports.CreateTimetableDto = CreateTimetableDto;
__decorate([
    (0, class_validator_1.IsUUID)('4', { message: 'teachingAssignmentId doit être un UUID valide' }),
    __metadata("design:type", String)
], CreateTimetableDto.prototype, "teachingAssignmentId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('4', { message: 'academicYearId doit être un UUID valide' }),
    __metadata("design:type", String)
], CreateTimetableDto.prototype, "academicYearId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(timetable_entity_1.DayOfWeek, { message: 'Le jour de la semaine doit être valide' }),
    __metadata("design:type", String)
], CreateTimetableDto.prototype, "dayOfWeek", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: "L'heure de début doit être une chaîne" }),
    (0, class_validator_1.Matches)(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: "L'heure de début doit être au format HH:MM",
    }),
    __metadata("design:type", String)
], CreateTimetableDto.prototype, "startTime", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: "L'heure de fin doit être une chaîne" }),
    (0, class_validator_1.Matches)(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: "L'heure de fin doit être au format HH:MM",
    }),
    __metadata("design:type", String)
], CreateTimetableDto.prototype, "endTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'La salle doit être une chaîne' }),
    (0, class_validator_1.MaxLength)(50, { message: 'La salle ne peut pas dépasser 50 caractères' }),
    __metadata("design:type", String)
], CreateTimetableDto.prototype, "room", void 0);
class UpdateTimetableDto extends (0, swagger_1.PartialType)(CreateTimetableDto) {
}
exports.UpdateTimetableDto = UpdateTimetableDto;
class TimetableResponseDto {
    id;
    teachingAssignmentId;
    academicYearId;
    dayOfWeek;
    startTime;
    endTime;
    room;
    createdAt;
    updatedAt;
    teachingAssignment;
    academicYear;
}
exports.TimetableResponseDto = TimetableResponseDto;
class WeeklyTimetableDto {
    classId;
    className;
    academicYearId;
    schedule;
}
exports.WeeklyTimetableDto = WeeklyTimetableDto;
//# sourceMappingURL=timetable.dto.js.map