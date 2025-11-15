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
exports.GradeComplaint = exports.ComplaintStatus = void 0;
const typeorm_1 = require("typeorm");
const student_entity_1 = require("./student.entity");
const assessment_entity_1 = require("./assessment.entity");
const grade_complaint_history_entity_1 = require("./grade-complaint-history.entity");
var ComplaintStatus;
(function (ComplaintStatus) {
    ComplaintStatus["PENDING"] = "pending";
    ComplaintStatus["UNDER_REVIEW"] = "under_review";
    ComplaintStatus["APPROVED"] = "approved";
    ComplaintStatus["REJECTED"] = "rejected";
})(ComplaintStatus || (exports.ComplaintStatus = ComplaintStatus = {}));
let GradeComplaint = class GradeComplaint {
    id;
    studentId;
    assessmentId;
    status;
    reason;
    createdAt;
    updatedAt;
    student;
    assessment;
    history;
};
exports.GradeComplaint = GradeComplaint;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], GradeComplaint.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], GradeComplaint.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], GradeComplaint.prototype, "assessmentId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ComplaintStatus,
        default: ComplaintStatus.PENDING,
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], GradeComplaint.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], GradeComplaint.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], GradeComplaint.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], GradeComplaint.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => student_entity_1.Student, (student) => student.gradeComplaints, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'student_id' }),
    __metadata("design:type", student_entity_1.Student)
], GradeComplaint.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => assessment_entity_1.Assessment, (assessment) => assessment.gradeComplaints, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'assessment_id' }),
    __metadata("design:type", assessment_entity_1.Assessment)
], GradeComplaint.prototype, "assessment", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => grade_complaint_history_entity_1.GradeComplaintHistory, (history) => history.complaint),
    __metadata("design:type", Array)
], GradeComplaint.prototype, "history", void 0);
exports.GradeComplaint = GradeComplaint = __decorate([
    (0, typeorm_1.Entity)('grade_complaints')
], GradeComplaint);
//# sourceMappingURL=grade-complaint.entity.js.map