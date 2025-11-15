"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentClassModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const student_class_controller_1 = require("./student-class.controller");
const student_class_service_1 = require("./student-class.service");
const student_class_entity_1 = require("../../entities/student-class.entity");
const student_entity_1 = require("../../entities/student.entity");
const class_entity_1 = require("../../entities/class.entity");
let StudentClassModule = class StudentClassModule {
};
exports.StudentClassModule = StudentClassModule;
exports.StudentClassModule = StudentClassModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([student_class_entity_1.StudentClass, student_entity_1.Student, class_entity_1.Class])],
        controllers: [student_class_controller_1.StudentClassController],
        providers: [student_class_service_1.StudentClassService],
        exports: [student_class_service_1.StudentClassService],
    })
], StudentClassModule);
//# sourceMappingURL=student-class.module.js.map