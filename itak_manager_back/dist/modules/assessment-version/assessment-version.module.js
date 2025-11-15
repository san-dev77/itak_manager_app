"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentVersionModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const assessment_version_service_1 = require("./assessment-version.service");
const assessment_version_controller_1 = require("./assessment-version.controller");
const assessment_version_entity_1 = require("../../entities/assessment-version.entity");
const assessment_entity_1 = require("../../entities/assessment.entity");
let AssessmentVersionModule = class AssessmentVersionModule {
};
exports.AssessmentVersionModule = AssessmentVersionModule;
exports.AssessmentVersionModule = AssessmentVersionModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([assessment_version_entity_1.AssessmentVersion, assessment_entity_1.Assessment])],
        controllers: [assessment_version_controller_1.AssessmentVersionController],
        providers: [assessment_version_service_1.AssessmentVersionService],
        exports: [assessment_version_service_1.AssessmentVersionService],
    })
], AssessmentVersionModule);
//# sourceMappingURL=assessment-version.module.js.map