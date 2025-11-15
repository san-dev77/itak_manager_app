"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentTransferModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const student_transfer_service_1 = require("./student-transfer.service");
const student_transfer_controller_1 = require("./student-transfer.controller");
const student_transfer_entity_1 = require("../../entities/student-transfer.entity");
const student_class_entity_1 = require("../../entities/student-class.entity");
const student_entity_1 = require("../../entities/student.entity");
const class_entity_1 = require("../../entities/class.entity");
let StudentTransferModule = class StudentTransferModule {
};
exports.StudentTransferModule = StudentTransferModule;
exports.StudentTransferModule = StudentTransferModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([student_transfer_entity_1.StudentTransfer, student_class_entity_1.StudentClass, student_entity_1.Student, class_entity_1.Class]),
        ],
        controllers: [student_transfer_controller_1.StudentTransferController],
        providers: [student_transfer_service_1.StudentTransferService],
        exports: [student_transfer_service_1.StudentTransferService],
    })
], StudentTransferModule);
//# sourceMappingURL=student-transfer.module.js.map