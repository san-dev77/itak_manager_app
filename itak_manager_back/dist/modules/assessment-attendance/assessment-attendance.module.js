"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentAttendanceModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const assessment_attendance_service_1 = require("./assessment-attendance.service");
const assessment_attendance_controller_1 = require("./assessment-attendance.controller");
const assessment_attendance_entity_1 = require("../../entities/assessment-attendance.entity");
const assessment_entity_1 = require("../../entities/assessment.entity");
const student_entity_1 = require("../../entities/student.entity");
let AssessmentAttendanceModule = class AssessmentAttendanceModule {
};
exports.AssessmentAttendanceModule = AssessmentAttendanceModule;
exports.AssessmentAttendanceModule = AssessmentAttendanceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([assessment_attendance_entity_1.AssessmentAttendance, assessment_entity_1.Assessment, student_entity_1.Student]),
        ],
        controllers: [assessment_attendance_controller_1.AssessmentAttendanceController],
        providers: [assessment_attendance_service_1.AssessmentAttendanceService],
        exports: [assessment_attendance_service_1.AssessmentAttendanceService],
    })
], AssessmentAttendanceModule);
//# sourceMappingURL=assessment-attendance.module.js.map