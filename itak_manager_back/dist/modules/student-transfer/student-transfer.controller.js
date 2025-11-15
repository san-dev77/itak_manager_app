"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentTransferController = void 0;
const common_1 = require("@nestjs/common");
const student_transfer_service_1 = require("./student-transfer.service");
const create_student_transfer_dto_1 = require("./dto/create-student-transfer.dto");
const update_student_transfer_dto_1 = require("./dto/update-student-transfer.dto");
const update_student_class_status_dto_1 = require("./dto/update-student-class-status.dto");
const student_transfer_entity_1 = require("../../entities/student-transfer.entity");
let StudentTransferController = class StudentTransferController {
    studentTransferService;
    constructor(studentTransferService) {
        this.studentTransferService = studentTransferService;
    }
    async create(createDto) {
        return this.studentTransferService.create(createDto);
    }
    async findAll(studentId, year, reason, fromClassId, toClassId) {
        return this.studentTransferService.findAll({
            studentId,
            year,
            reason,
            fromClassId,
            toClassId,
        });
    }
    async findOne(id) {
        return this.studentTransferService.findOne(id);
    }
    async findByStudent(studentId, year) {
        return this.studentTransferService.findAll({ studentId, year });
    }
    async findTransfersFromClass(classId, year) {
        return this.studentTransferService.findAll({ fromClassId: classId, year });
    }
    async findTransfersToClass(classId, year) {
        return this.studentTransferService.findAll({ toClassId: classId, year });
    }
    async update(id, updateDto) {
        return this.studentTransferService.update(id, updateDto);
    }
    async executeTransfer(id) {
        return this.studentTransferService.executeTransfer(id);
    }
    async reverseTransfer(id) {
        return this.studentTransferService.reverseTransfer(id);
    }
    async updateStudentClassStatus(studentId, classId, year, updateDto) {
        return this.studentTransferService.updateStudentClassStatus(studentId, classId, year, updateDto);
    }
    async remove(id) {
        return this.studentTransferService.remove(id);
    }
};
exports.StudentTransferController = StudentTransferController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_student_transfer_dto_1.CreateStudentTransferDto]),
    __metadata("design:returntype", Promise)
], StudentTransferController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('studentId')),
    __param(1, (0, common_1.Query)('year')),
    __param(2, (0, common_1.Query)('reason')),
    __param(3, (0, common_1.Query)('fromClassId')),
    __param(4, (0, common_1.Query)('toClassId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], StudentTransferController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentTransferController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('student/:studentId'),
    __param(0, (0, common_1.Param)('studentId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], StudentTransferController.prototype, "findByStudent", null);
__decorate([
    (0, common_1.Get)('class/:classId/from'),
    __param(0, (0, common_1.Param)('classId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], StudentTransferController.prototype, "findTransfersFromClass", null);
__decorate([
    (0, common_1.Get)('class/:classId/to'),
    __param(0, (0, common_1.Param)('classId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], StudentTransferController.prototype, "findTransfersToClass", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_student_transfer_dto_1.UpdateStudentTransferDto]),
    __metadata("design:returntype", Promise)
], StudentTransferController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/execute'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentTransferController.prototype, "executeTransfer", null);
__decorate([
    (0, common_1.Post)(':id/reverse'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentTransferController.prototype, "reverseTransfer", null);
__decorate([
    (0, common_1.Patch)('student-class/:studentId/:classId/:year/status'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('studentId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('classId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Param)('year')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, update_student_class_status_dto_1.UpdateStudentClassStatusDto]),
    __metadata("design:returntype", Promise)
], StudentTransferController.prototype, "updateStudentClassStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentTransferController.prototype, "remove", null);
exports.StudentTransferController = StudentTransferController = __decorate([
    (0, common_1.Controller)('student-transfers'),
    __metadata("design:paramtypes", [student_transfer_service_1.StudentTransferService])
], StudentTransferController);
//# sourceMappingURL=student-transfer.controller.js.map