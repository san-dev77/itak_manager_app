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
exports.Assessment = exports.AssessmentType = void 0;
const typeorm_1 = require("typeorm");
const term_entity_1 = require("./term.entity");
const class_subject_entity_1 = require("./class-subject.entity");
const assessment_result_entity_1 = require("./assessment-result.entity");
const grade_complaint_entity_1 = require("./grade-complaint.entity");
const assessment_subject_entity_1 = require("./assessment-subject.entity");
const school_year_entity_1 = require("./school-year.entity");
const assessment_attendance_entity_1 = require("./assessment-attendance.entity");
const assessment_version_entity_1 = require("./assessment-version.entity");
var AssessmentType;
(function (AssessmentType) {
    AssessmentType["EXAM"] = "exam";
    AssessmentType["HOMEWORK"] = "homework";
    AssessmentType["SUPERVISED_HOMEWORK"] = "supervised_homework";
    AssessmentType["TEST"] = "test";
    AssessmentType["QUIZ"] = "quiz";
    AssessmentType["MONTHLY_COMPOSITION"] = "monthly_composition";
    AssessmentType["CONTINUOUS_ASSESSMENT"] = "continuous_assessment";
})(AssessmentType || (exports.AssessmentType = AssessmentType = {}));
let Assessment = class Assessment {
    id;
    termId;
    classSubjectId;
    schoolYearId;
    type;
    title;
    description;
    startDate;
    endDate;
    maxScore;
    weight;
    createdAt;
    updatedAt;
    term;
    classSubject;
    schoolYear;
    results;
    gradeComplaints;
    subjects;
    attendances;
    versions;
};
exports.Assessment = Assessment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Assessment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Assessment.prototype, "termId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Assessment.prototype, "classSubjectId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Assessment.prototype, "schoolYearId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AssessmentType,
        default: AssessmentType.TEST,
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Assessment.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Assessment.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Assessment.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], Assessment.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], Assessment.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], Assessment.prototype, "maxScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 1.0 }),
    __metadata("design:type", Number)
], Assessment.prototype, "weight", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Assessment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Assessment.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => term_entity_1.Term, (term) => term.assessments, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'term_id' }),
    __metadata("design:type", term_entity_1.Term)
], Assessment.prototype, "term", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => class_subject_entity_1.ClassSubject, (classSubject) => classSubject.assessments, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'class_subject_id' }),
    __metadata("design:type", class_subject_entity_1.ClassSubject)
], Assessment.prototype, "classSubject", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => school_year_entity_1.SchoolYear, (schoolYear) => schoolYear.assessments, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'school_year_id' }),
    __metadata("design:type", school_year_entity_1.SchoolYear)
], Assessment.prototype, "schoolYear", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => assessment_result_entity_1.AssessmentResult, (result) => result.assessment),
    __metadata("design:type", Array)
], Assessment.prototype, "results", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => grade_complaint_entity_1.GradeComplaint, (complaint) => complaint.assessment),
    __metadata("design:type", Array)
], Assessment.prototype, "gradeComplaints", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => assessment_subject_entity_1.AssessmentSubject, (subject) => subject.assessment),
    __metadata("design:type", Array)
], Assessment.prototype, "subjects", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => assessment_attendance_entity_1.AssessmentAttendance, (attendance) => attendance.assessment),
    __metadata("design:type", Array)
], Assessment.prototype, "attendances", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => assessment_version_entity_1.AssessmentVersion, (version) => version.assessment),
    __metadata("design:type", Array)
], Assessment.prototype, "versions", void 0);
exports.Assessment = Assessment = __decorate([
    (0, typeorm_1.Entity)('assessments')
], Assessment);
//# sourceMappingURL=assessment.entity.js.map