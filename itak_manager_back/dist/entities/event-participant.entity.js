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
exports.EventParticipant = exports.ParticipantStatus = exports.ParticipantRole = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
var ParticipantRole;
(function (ParticipantRole) {
    ParticipantRole["STUDENT"] = "student";
    ParticipantRole["TEACHER"] = "teacher";
    ParticipantRole["STAFF"] = "staff";
    ParticipantRole["OTHER"] = "other";
})(ParticipantRole || (exports.ParticipantRole = ParticipantRole = {}));
var ParticipantStatus;
(function (ParticipantStatus) {
    ParticipantStatus["INVITED"] = "invited";
    ParticipantStatus["CONFIRMED"] = "confirmed";
    ParticipantStatus["DECLINED"] = "declined";
    ParticipantStatus["ABSENT"] = "absent";
})(ParticipantStatus || (exports.ParticipantStatus = ParticipantStatus = {}));
let EventParticipant = class EventParticipant {
    id;
    eventId;
    userId;
    role;
    status;
    event;
    user;
};
exports.EventParticipant = EventParticipant;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], EventParticipant.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], EventParticipant.prototype, "eventId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], EventParticipant.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ParticipantRole,
        nullable: false,
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], EventParticipant.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ParticipantStatus,
        default: ParticipantStatus.INVITED,
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], EventParticipant.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Event', 'participants', {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'event_id' }),
    __metadata("design:type", Object)
], EventParticipant.prototype, "event", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], EventParticipant.prototype, "user", void 0);
exports.EventParticipant = EventParticipant = __decorate([
    (0, typeorm_1.Entity)('event_participants'),
    (0, typeorm_1.Index)(['eventId', 'userId'], { unique: true }),
    (0, typeorm_1.Index)(['eventId', 'role']),
    (0, typeorm_1.Index)(['eventId', 'status'])
], EventParticipant);
//# sourceMappingURL=event-participant.entity.js.map