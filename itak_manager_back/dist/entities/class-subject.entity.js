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
exports.ClassSubject = void 0;
const typeorm_1 = require("typeorm");
const class_entity_1 = require("./class.entity");
const subject_entity_1 = require("./subject.entity");
const teaching_assignment_entity_1 = require("./teaching-assignment.entity");
const assessment_entity_1 = require("./assessment.entity");
let ClassSubject = class ClassSubject {
    id;
    classId;
    subjectId;
    coefficient;
    weeklyHours;
    isOptional;
    createdAt;
    updatedAt;
    class;
    subject;
    teachingAssignments;
    assessments;
};
exports.ClassSubject = ClassSubject;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ClassSubject.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], ClassSubject.prototype, "classId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], ClassSubject.prototype, "subjectId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 1 }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], ClassSubject.prototype, "coefficient", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], ClassSubject.prototype, "weeklyHours", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], ClassSubject.prototype, "isOptional", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], ClassSubject.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], ClassSubject.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => class_entity_1.Class, (classEntity) => classEntity.classSubjects, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'class_id' }),
    __metadata("design:type", class_entity_1.Class)
], ClassSubject.prototype, "class", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => subject_entity_1.Subject, (subject) => subject.classSubjects, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'subject_id' }),
    __metadata("design:type", subject_entity_1.Subject)
], ClassSubject.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => teaching_assignment_entity_1.TeachingAssignment, (assignment) => assignment.classSubject),
    __metadata("design:type", Array)
], ClassSubject.prototype, "teachingAssignments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => assessment_entity_1.Assessment, (assessment) => assessment.classSubject),
    __metadata("design:type", Array)
], ClassSubject.prototype, "assessments", void 0);
exports.ClassSubject = ClassSubject = __decorate([
    (0, typeorm_1.Entity)('class_subjects'),
    (0, typeorm_1.Unique)(['classId', 'subjectId']),
    (0, typeorm_1.Check)('chk_coefficient_positive', 'coefficient >= 0'),
    (0, typeorm_1.Check)('chk_weekly_hours_positive', 'weekly_hours IS NULL OR weekly_hours >= 0')
], ClassSubject);
//# sourceMappingURL=class-subject.entity.js.map