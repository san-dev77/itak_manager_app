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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkCreateAttendanceDto = exports.StudentAttendanceDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const assessment_attendance_entity_1 = require("../../../entities/assessment-attendance.entity");
class StudentAttendanceDto {
    studentId;
    status;
    reason;
}
exports.StudentAttendanceDto = StudentAttendanceDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], StudentAttendanceDto.prototype, "studentId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(assessment_attendance_entity_1.AttendanceStatus),
    __metadata("design:type", String)
], StudentAttendanceDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], StudentAttendanceDto.prototype, "reason", void 0);
class BulkCreateAttendanceDto {
    assessmentId;
    attendances;
    markedBy;
}
exports.BulkCreateAttendanceDto = BulkCreateAttendanceDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], BulkCreateAttendanceDto.prototype, "assessmentId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => StudentAttendanceDto),
    __metadata("design:type", Array)
], BulkCreateAttendanceDto.prototype, "attendances", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], BulkCreateAttendanceDto.prototype, "markedBy", void 0);
//# sourceMappingURL=bulk-create-attendance.dto.js.map