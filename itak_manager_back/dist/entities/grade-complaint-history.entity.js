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
exports.GradeComplaintHistory = void 0;
const typeorm_1 = require("typeorm");
const grade_complaint_entity_1 = require("./grade-complaint.entity");
const user_entity_1 = require("./user.entity");
let GradeComplaintHistory = class GradeComplaintHistory {
    id;
    complaintId;
    oldScore;
    newScore;
    changedBy;
    changedAt;
    comment;
    complaint;
    changedByUser;
};
exports.GradeComplaintHistory = GradeComplaintHistory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], GradeComplaintHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], GradeComplaintHistory.prototype, "complaintId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 5,
        scale: 2,
        nullable: true,
    }),
    __metadata("design:type", Number)
], GradeComplaintHistory.prototype, "oldScore", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 5,
        scale: 2,
        nullable: true,
    }),
    __metadata("design:type", Number)
], GradeComplaintHistory.prototype, "newScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], GradeComplaintHistory.prototype, "changedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], GradeComplaintHistory.prototype, "changedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], GradeComplaintHistory.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => grade_complaint_entity_1.GradeComplaint, (complaint) => complaint.history, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'complaint_id' }),
    __metadata("design:type", grade_complaint_entity_1.GradeComplaint)
], GradeComplaintHistory.prototype, "complaint", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.gradeComplaintHistory, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'changed_by' }),
    __metadata("design:type", user_entity_1.User)
], GradeComplaintHistory.prototype, "changedByUser", void 0);
exports.GradeComplaintHistory = GradeComplaintHistory = __decorate([
    (0, typeorm_1.Entity)('grade_complaint_history')
], GradeComplaintHistory);
//# sourceMappingURL=grade-complaint-history.entity.js.map