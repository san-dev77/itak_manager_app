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
exports.AssessmentResult = exports.AssessmentResultStatus = void 0;
const typeorm_1 = require("typeorm");
const assessment_entity_1 = require("./assessment.entity");
const student_entity_1 = require("./student.entity");
var AssessmentResultStatus;
(function (AssessmentResultStatus) {
    AssessmentResultStatus["PRESENT"] = "present";
    AssessmentResultStatus["ABSENT"] = "absent";
    AssessmentResultStatus["EXCUSED"] = "excused";
    AssessmentResultStatus["EXCLUDED"] = "excluded";
})(AssessmentResultStatus || (exports.AssessmentResultStatus = AssessmentResultStatus = {}));
let AssessmentResult = class AssessmentResult {
    id;
    assessmentId;
    studentId;
    score;
    remarks;
    status;
    createdAt;
    updatedAt;
    assessment;
    student;
};
exports.AssessmentResult = AssessmentResult;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AssessmentResult.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], AssessmentResult.prototype, "assessmentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], AssessmentResult.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], AssessmentResult.prototype, "score", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssessmentResult.prototype, "remarks", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AssessmentResultStatus,
        default: AssessmentResultStatus.PRESENT,
    }),
    __metadata("design:type", String)
], AssessmentResult.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AssessmentResult.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], AssessmentResult.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => assessment_entity_1.Assessment, (assessment) => assessment.results, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'assessment_id' }),
    __metadata("design:type", assessment_entity_1.Assessment)
], AssessmentResult.prototype, "assessment", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => student_entity_1.Student, (student) => student.assessmentResults, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'student_id' }),
    __metadata("design:type", student_entity_1.Student)
], AssessmentResult.prototype, "student", void 0);
exports.AssessmentResult = AssessmentResult = __decorate([
    (0, typeorm_1.Entity)('assessment_results'),
    (0, typeorm_1.Index)(['assessmentId', 'studentId'], { unique: true })
], AssessmentResult);
//# sourceMappingURL=assessment-result.entity.js.map