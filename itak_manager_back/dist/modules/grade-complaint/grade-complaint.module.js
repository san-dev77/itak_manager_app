"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GradeComplaintModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const grade_complaint_service_1 = require("./grade-complaint.service");
const grade_complaint_controller_1 = require("./grade-complaint.controller");
const grade_complaint_entity_1 = require("../../entities/grade-complaint.entity");
const grade_complaint_history_entity_1 = require("../../entities/grade-complaint-history.entity");
const assessment_entity_1 = require("../../entities/assessment.entity");
const student_entity_1 = require("../../entities/student.entity");
const assessment_result_entity_1 = require("../../entities/assessment-result.entity");
let GradeComplaintModule = class GradeComplaintModule {
};
exports.GradeComplaintModule = GradeComplaintModule;
exports.GradeComplaintModule = GradeComplaintModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                grade_complaint_entity_1.GradeComplaint,
                grade_complaint_history_entity_1.GradeComplaintHistory,
                assessment_entity_1.Assessment,
                student_entity_1.Student,
                assessment_result_entity_1.AssessmentResult,
            ]),
        ],
        controllers: [grade_complaint_controller_1.GradeComplaintController],
        providers: [grade_complaint_service_1.GradeComplaintService],
        exports: [grade_complaint_service_1.GradeComplaintService],
    })
], GradeComplaintModule);
//# sourceMappingURL=grade-complaint.module.js.map