"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassSubjectModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const class_subject_service_1 = require("./class-subject.service");
const class_subject_controller_1 = require("./class-subject.controller");
const class_subject_entity_1 = require("../../entities/class-subject.entity");
const class_entity_1 = require("../../entities/class.entity");
const subject_entity_1 = require("../../entities/subject.entity");
let ClassSubjectModule = class ClassSubjectModule {
};
exports.ClassSubjectModule = ClassSubjectModule;
exports.ClassSubjectModule = ClassSubjectModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([class_subject_entity_1.ClassSubject, class_entity_1.Class, subject_entity_1.Subject])],
        controllers: [class_subject_controller_1.ClassSubjectController],
        providers: [class_subject_service_1.ClassSubjectService],
        exports: [class_subject_service_1.ClassSubjectService],
    })
], ClassSubjectModule);
//# sourceMappingURL=class-subject.module.js.map