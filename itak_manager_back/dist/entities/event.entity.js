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
exports.Event = exports.EventType = void 0;
const typeorm_1 = require("typeorm");
const class_entity_1 = require("./class.entity");
const user_entity_1 = require("./user.entity");
const school_year_entity_1 = require("./school-year.entity");
var EventType;
(function (EventType) {
    EventType["EXAM"] = "exam";
    EventType["HOMEWORK"] = "homework";
    EventType["CULTURAL_DAY"] = "cultural_day";
    EventType["HEALTH_DAY"] = "health_day";
    EventType["BALL"] = "ball";
    EventType["OTHER"] = "other";
})(EventType || (exports.EventType = EventType = {}));
let Event = class Event {
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
};
exports.Event = Event;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Event.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], Event.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Event.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EventType,
        nullable: false,
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Event.prototype, "eventType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], Event.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Event.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Event.prototype, "allDay", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Event.prototype, "classId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Event.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Event.prototype, "academicYearId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Event.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Event.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => class_entity_1.Class, {
        onDelete: 'CASCADE',
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)({ name: 'class_id' }),
    __metadata("design:type", class_entity_1.Class)
], Event.prototype, "class", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], Event.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => school_year_entity_1.SchoolYear, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'academic_year_id' }),
    __metadata("design:type", school_year_entity_1.SchoolYear)
], Event.prototype, "academicYear", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('EventParticipant', 'event'),
    __metadata("design:type", Array)
], Event.prototype, "participants", void 0);
exports.Event = Event = __decorate([
    (0, typeorm_1.Entity)('events'),
    (0, typeorm_1.Index)(['startDate', 'eventType']),
    (0, typeorm_1.Index)(['classId', 'startDate']),
    (0, typeorm_1.Index)(['academicYearId', 'startDate'])
], Event);
//# sourceMappingURL=event.entity.js.map