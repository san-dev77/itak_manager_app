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
exports.AssessmentAttendanceController = void 0;
const common_1 = require("@nestjs/common");
const assessment_attendance_service_1 = require("./assessment-attendance.service");
const create_assessment_attendance_dto_1 = require("./dto/create-assessment-attendance.dto");
const update_assessment_attendance_dto_1 = require("./dto/update-assessment-attendance.dto");
const bulk_create_attendance_dto_1 = require("./dto/bulk-create-attendance.dto");
const assessment_attendance_entity_1 = require("../../entities/assessment-attendance.entity");
let AssessmentAttendanceController = class AssessmentAttendanceController {
    attendanceService;
    constructor(attendanceService) {
        this.attendanceService = attendanceService;
    }
    create(createDto) {
        return this.attendanceService.create(createDto);
    }
    bulkCreate(bulkDto) {
        return this.attendanceService.bulkCreate(bulkDto);
    }
    findAll(assessmentId, studentId, status) {
        return this.attendanceService.findAll({
            assessmentId,
            studentId,
            status,
        });
    }
    findByAssessment(assessmentId) {
        return this.attendanceService.findByAssessment(assessmentId);
    }
    findByStudent(studentId) {
        return this.attendanceService.findByStudent(studentId);
    }
    getAttendanceStats(assessmentId) {
        return this.attendanceService.getAttendanceStats(assessmentId);
    }
    findOne(assessmentId, studentId) {
        return this.attendanceService.findOne(assessmentId, studentId);
    }
    update(assessmentId, studentId, updateDto) {
        return this.attendanceService.update(assessmentId, studentId, updateDto);
    }
    remove(assessmentId, studentId) {
        return this.attendanceService.remove(assessmentId, studentId);
    }
};
exports.AssessmentAttendanceController = AssessmentAttendanceController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_assessment_attendance_dto_1.CreateAssessmentAttendanceDto]),
    __metadata("design:returntype", void 0)
], AssessmentAttendanceController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('bulk'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bulk_create_attendance_dto_1.BulkCreateAttendanceDto]),
    __metadata("design:returntype", void 0)
], AssessmentAttendanceController.prototype, "bulkCreate", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('assessmentId')),
    __param(1, (0, common_1.Query)('studentId')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], AssessmentAttendanceController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('assessment/:assessmentId'),
    __param(0, (0, common_1.Param)('assessmentId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssessmentAttendanceController.prototype, "findByAssessment", null);
__decorate([
    (0, common_1.Get)('student/:studentId'),
    __param(0, (0, common_1.Param)('studentId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssessmentAttendanceController.prototype, "findByStudent", null);
__decorate([
    (0, common_1.Get)('stats/:assessmentId'),
    __param(0, (0, common_1.Param)('assessmentId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssessmentAttendanceController.prototype, "getAttendanceStats", null);
__decorate([
    (0, common_1.Get)(':assessmentId/:studentId'),
    __param(0, (0, common_1.Param)('assessmentId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('studentId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AssessmentAttendanceController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':assessmentId/:studentId'),
    __param(0, (0, common_1.Param)('assessmentId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('studentId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_assessment_attendance_dto_1.UpdateAssessmentAttendanceDto]),
    __metadata("design:returntype", void 0)
], AssessmentAttendanceController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':assessmentId/:studentId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('assessmentId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('studentId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AssessmentAttendanceController.prototype, "remove", null);
exports.AssessmentAttendanceController = AssessmentAttendanceController = __decorate([
    (0, common_1.Controller)('assessment-attendance'),
    __metadata("design:paramtypes", [assessment_attendance_service_1.AssessmentAttendanceService])
], AssessmentAttendanceController);
//# sourceMappingURL=assessment-attendance.controller.js.map