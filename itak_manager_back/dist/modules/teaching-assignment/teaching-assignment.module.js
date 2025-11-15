"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeachingAssignmentModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const teaching_assignment_service_1 = require("./teaching-assignment.service");
const teaching_assignment_controller_1 = require("./teaching-assignment.controller");
const teaching_assignment_entity_1 = require("../../entities/teaching-assignment.entity");
const teacher_entity_1 = require("../../entities/teacher.entity");
const class_subject_entity_1 = require("../../entities/class-subject.entity");
let TeachingAssignmentModule = class TeachingAssignmentModule {
};
exports.TeachingAssignmentModule = TeachingAssignmentModule;
exports.TeachingAssignmentModule = TeachingAssignmentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([teaching_assignment_entity_1.TeachingAssignment, teacher_entity_1.Teacher, class_subject_entity_1.ClassSubject]),
        ],
        controllers: [teaching_assignment_controller_1.TeachingAssignmentController],
        providers: [teaching_assignment_service_1.TeachingAssignmentService],
        exports: [teaching_assignment_service_1.TeachingAssignmentService],
    })
], TeachingAssignmentModule);
//# sourceMappingURL=teaching-assignment.module.js.map