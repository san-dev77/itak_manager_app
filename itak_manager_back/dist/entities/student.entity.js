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
exports.Student = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const student_class_entity_1 = require("./student-class.entity");
const student_parent_entity_1 = require("./student-parent.entity");
const student_promotion_entity_1 = require("./student-promotion.entity");
const assessment_result_entity_1 = require("./assessment-result.entity");
const grade_complaint_entity_1 = require("./grade-complaint.entity");
const student_transfer_entity_1 = require("./student-transfer.entity");
const assessment_attendance_entity_1 = require("./assessment-attendance.entity");
const student_fee_entity_1 = require("./student-fee.entity");
const invoice_entity_1 = require("./invoice.entity");
let Student = class Student {
    id;
    userId;
    matricule;
    enrollmentDate;
    photo;
    maritalStatus;
    fatherName;
    motherName;
    tutorName;
    tutorPhone;
    address;
    emergencyContact;
    notes;
    createdAt;
    updatedAt;
    user;
    studentClasses;
    studentParents;
    promotions;
    assessmentResults;
    gradeComplaints;
    transfers;
    assessmentAttendances;
    studentFees;
    invoices;
};
exports.Student = Student;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Student.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', unique: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Student.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, unique: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Student.prototype, "matricule", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], Student.prototype, "enrollmentDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Student.prototype, "photo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], Student.prototype, "maritalStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Student.prototype, "fatherName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Student.prototype, "motherName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Student.prototype, "tutorName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], Student.prototype, "tutorPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Student.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Student.prototype, "emergencyContact", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Student.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Student.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Student.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.students, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Student.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => student_class_entity_1.StudentClass, (studentClass) => studentClass.student),
    __metadata("design:type", Array)
], Student.prototype, "studentClasses", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => student_parent_entity_1.StudentParent, (studentParent) => studentParent.student),
    __metadata("design:type", Array)
], Student.prototype, "studentParents", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => student_promotion_entity_1.StudentPromotion, (promotion) => promotion.student),
    __metadata("design:type", Array)
], Student.prototype, "promotions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => assessment_result_entity_1.AssessmentResult, (result) => result.student),
    __metadata("design:type", Array)
], Student.prototype, "assessmentResults", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => grade_complaint_entity_1.GradeComplaint, (complaint) => complaint.student),
    __metadata("design:type", Array)
], Student.prototype, "gradeComplaints", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => student_transfer_entity_1.StudentTransfer, (transfer) => transfer.student),
    __metadata("design:type", Array)
], Student.prototype, "transfers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => assessment_attendance_entity_1.AssessmentAttendance, (attendance) => attendance.student),
    __metadata("design:type", Array)
], Student.prototype, "assessmentAttendances", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => student_fee_entity_1.StudentFee, (studentFee) => studentFee.student),
    __metadata("design:type", Array)
], Student.prototype, "studentFees", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => invoice_entity_1.Invoice, (invoice) => invoice.student),
    __metadata("design:type", Array)
], Student.prototype, "invoices", void 0);
exports.Student = Student = __decorate([
    (0, typeorm_1.Entity)('students')
], Student);
//# sourceMappingURL=student.entity.js.map