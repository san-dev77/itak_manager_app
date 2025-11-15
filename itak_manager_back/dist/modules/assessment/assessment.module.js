"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const assessment_service_1 = require("./assessment.service");
const assessment_controller_1 = require("./assessment.controller");
const assessment_entity_1 = require("../../entities/assessment.entity");
const term_entity_1 = require("../../entities/term.entity");
const class_subject_entity_1 = require("../../entities/class-subject.entity");
let AssessmentModule = class AssessmentModule {
};
exports.AssessmentModule = AssessmentModule;
exports.AssessmentModule = AssessmentModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([assessment_entity_1.Assessment, term_entity_1.Term, class_subject_entity_1.ClassSubject])],
        controllers: [assessment_controller_1.AssessmentController],
        providers: [assessment_service_1.AssessmentService],
        exports: [assessment_service_1.AssessmentService],
    })
], AssessmentModule);
//# sourceMappingURL=assessment.module.js.map