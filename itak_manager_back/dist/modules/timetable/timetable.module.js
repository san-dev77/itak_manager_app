"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimetableModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const timetable_service_1 = require("./timetable.service");
const timetable_controller_1 = require("./timetable.controller");
const timetable_entity_1 = require("../../entities/timetable.entity");
const teaching_assignment_entity_1 = require("../../entities/teaching-assignment.entity");
const school_year_entity_1 = require("../../entities/school-year.entity");
const class_entity_1 = require("../../entities/class.entity");
const user_entity_1 = require("../../entities/user.entity");
let TimetableModule = class TimetableModule {
};
exports.TimetableModule = TimetableModule;
exports.TimetableModule = TimetableModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                timetable_entity_1.Timetable,
                teaching_assignment_entity_1.TeachingAssignment,
                school_year_entity_1.SchoolYear,
                class_entity_1.Class,
                user_entity_1.User,
            ]),
        ],
        controllers: [timetable_controller_1.TimetableController],
        providers: [timetable_service_1.TimetableService],
        exports: [timetable_service_1.TimetableService],
    })
], TimetableModule);
//# sourceMappingURL=timetable.module.js.map