"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentSubjectModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const assessment_subject_service_1 = require("./assessment-subject.service");
const assessment_subject_controller_1 = require("./assessment-subject.controller");
const assessment_subject_entity_1 = require("../../entities/assessment-subject.entity");
const assessment_entity_1 = require("../../entities/assessment.entity");
const user_entity_1 = require("../../entities/user.entity");
const file_upload_service_1 = require("../../services/file-upload.service");
let AssessmentSubjectModule = class AssessmentSubjectModule {
};
exports.AssessmentSubjectModule = AssessmentSubjectModule;
exports.AssessmentSubjectModule = AssessmentSubjectModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([assessment_subject_entity_1.AssessmentSubject, assessment_entity_1.Assessment, user_entity_1.User])],
        controllers: [assessment_subject_controller_1.AssessmentSubjectController],
        providers: [assessment_subject_service_1.AssessmentSubjectService, file_upload_service_1.FileUploadService],
        exports: [assessment_subject_service_1.AssessmentSubjectService, file_upload_service_1.FileUploadService],
    })
], AssessmentSubjectModule);
//# sourceMappingURL=assessment-subject.module.js.map