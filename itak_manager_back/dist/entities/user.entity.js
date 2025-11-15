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
exports.User = exports.UserRole = void 0;
const typeorm_1 = require("typeorm");
const student_entity_1 = require("./student.entity");
const teacher_entity_1 = require("./teacher.entity");
const staff_entity_1 = require("./staff.entity");
const parent_entity_1 = require("./parent.entity");
const grade_complaint_history_entity_1 = require("./grade-complaint-history.entity");
const assessment_subject_entity_1 = require("./assessment-subject.entity");
const payment_entity_1 = require("./payment.entity");
const refund_entity_1 = require("./refund.entity");
const discount_entity_1 = require("./discount.entity");
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["SUPER_ADMIN"] = "super_admin";
    UserRole["TEACHER"] = "teacher";
    UserRole["STUDENT"] = "student";
    UserRole["STAFF"] = "staff";
    UserRole["PARENT"] = "parent";
})(UserRole || (exports.UserRole = UserRole = {}));
let User = class User {
    id;
    username;
    email;
    firstName;
    lastName;
    gender;
    birthDate;
    phone;
    password;
    role;
    isActive;
    createdAt;
    updatedAt;
    students;
    teachers;
    staff;
    parents;
    gradeComplaintHistory;
    assessmentSubjects;
    receivedPayments;
    processedRefunds;
    approvedDiscounts;
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, unique: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, unique: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "birthDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: UserRole,
        default: UserRole.STUDENT,
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => student_entity_1.Student, (student) => student.user),
    __metadata("design:type", Array)
], User.prototype, "students", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => teacher_entity_1.Teacher, (teacher) => teacher.user),
    __metadata("design:type", Array)
], User.prototype, "teachers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => staff_entity_1.Staff, (staff) => staff.user),
    __metadata("design:type", Array)
], User.prototype, "staff", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => parent_entity_1.Parent, (parent) => parent.user),
    __metadata("design:type", Array)
], User.prototype, "parents", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => grade_complaint_history_entity_1.GradeComplaintHistory, (history) => history.changedByUser),
    __metadata("design:type", Array)
], User.prototype, "gradeComplaintHistory", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => assessment_subject_entity_1.AssessmentSubject, (subject) => subject.uploadedByUser),
    __metadata("design:type", Array)
], User.prototype, "assessmentSubjects", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => payment_entity_1.Payment, (payment) => payment.receivedByUser),
    __metadata("design:type", Array)
], User.prototype, "receivedPayments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => refund_entity_1.Refund, (refund) => refund.processedByUser),
    __metadata("design:type", Array)
], User.prototype, "processedRefunds", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => discount_entity_1.Discount, (discount) => discount.approvedByUser),
    __metadata("design:type", Array)
], User.prototype, "approvedDiscounts", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);
//# sourceMappingURL=user.entity.js.map