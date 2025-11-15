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
exports.CreateAssessmentAttendanceDto = void 0;
const class_validator_1 = require("class-validator");
const assessment_attendance_entity_1 = require("../../../entities/assessment-attendance.entity");
class CreateAssessmentAttendanceDto {
    assessmentId;
    studentId;
    status;
    reason;
    markedBy;
}
exports.CreateAssessmentAttendanceDto = CreateAssessmentAttendanceDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAssessmentAttendanceDto.prototype, "assessmentId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAssessmentAttendanceDto.prototype, "studentId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(assessment_attendance_entity_1.AttendanceStatus),
    __metadata("design:type", String)
], CreateAssessmentAttendanceDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateAssessmentAttendanceDto.prototype, "reason", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAssessmentAttendanceDto.prototype, "markedBy", void 0);
//# sourceMappingURL=create-assessment-attendance.dto.js.map