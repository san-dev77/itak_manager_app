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
exports.TeachingAssignment = void 0;
const typeorm_1 = require("typeorm");
const teacher_entity_1 = require("./teacher.entity");
const class_subject_entity_1 = require("./class-subject.entity");
let TeachingAssignment = class TeachingAssignment {
    id;
    teacherId;
    classSubjectId;
    startDate;
    endDate;
    createdAt;
    updatedAt;
    teacher;
    classSubject;
};
exports.TeachingAssignment = TeachingAssignment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TeachingAssignment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], TeachingAssignment.prototype, "teacherId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], TeachingAssignment.prototype, "classSubjectId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], TeachingAssignment.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], TeachingAssignment.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], TeachingAssignment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], TeachingAssignment.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => teacher_entity_1.Teacher, (teacher) => teacher.teachingAssignments, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'teacher_id' }),
    __metadata("design:type", teacher_entity_1.Teacher)
], TeachingAssignment.prototype, "teacher", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => class_subject_entity_1.ClassSubject, (classSubject) => classSubject.teachingAssignments, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'class_subject_id' }),
    __metadata("design:type", class_subject_entity_1.ClassSubject)
], TeachingAssignment.prototype, "classSubject", void 0);
exports.TeachingAssignment = TeachingAssignment = __decorate([
    (0, typeorm_1.Entity)('teaching_assignments'),
    (0, typeorm_1.Unique)(['teacherId', 'classSubjectId']),
    (0, typeorm_1.Check)('chk_start_date_not_future', 'start_date <= CURRENT_DATE'),
    (0, typeorm_1.Check)('chk_end_date_after_start', 'end_date IS NULL OR end_date >= start_date')
], TeachingAssignment);
//# sourceMappingURL=teaching-assignment.entity.js.map