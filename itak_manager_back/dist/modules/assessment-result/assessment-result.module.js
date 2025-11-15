"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentResultModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const assessment_result_service_1 = require("./assessment-result.service");
const assessment_result_controller_1 = require("./assessment-result.controller");
const assessment_result_entity_1 = require("../../entities/assessment-result.entity");
const assessment_entity_1 = require("../../entities/assessment.entity");
const student_entity_1 = require("../../entities/student.entity");
let AssessmentResultModule = class AssessmentResultModule {
};
exports.AssessmentResultModule = AssessmentResultModule;
exports.AssessmentResultModule = AssessmentResultModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([assessment_result_entity_1.AssessmentResult, assessment_entity_1.Assessment, student_entity_1.Student])],
        controllers: [assessment_result_controller_1.AssessmentResultController],
        providers: [assessment_result_service_1.AssessmentResultService],
        exports: [assessment_result_service_1.AssessmentResultService],
    })
], AssessmentResultModule);
//# sourceMappingURL=assessment-result.module.js.map