"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventParticipantModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const event_participant_service_1 = require("./event-participant.service");
const event_participant_controller_1 = require("./event-participant.controller");
const event_participant_entity_1 = require("../../entities/event-participant.entity");
const event_entity_1 = require("../../entities/event.entity");
const user_entity_1 = require("../../entities/user.entity");
let EventParticipantModule = class EventParticipantModule {
};
exports.EventParticipantModule = EventParticipantModule;
exports.EventParticipantModule = EventParticipantModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([event_participant_entity_1.EventParticipant, event_entity_1.Event, user_entity_1.User])],
        controllers: [event_participant_controller_1.EventParticipantController],
        providers: [event_participant_service_1.EventParticipantService],
        exports: [event_participant_service_1.EventParticipantService],
    })
], EventParticipantModule);
//# sourceMappingURL=event-participant.module.js.map