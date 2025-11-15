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
exports.AssessmentVersion = exports.VersionAction = exports.AssessmentVersionType = void 0;
const typeorm_1 = require("typeorm");
const assessment_entity_1 = require("./assessment.entity");
const user_entity_1 = require("./user.entity");
var AssessmentVersionType;
(function (AssessmentVersionType) {
    AssessmentVersionType["EXAM"] = "exam";
    AssessmentVersionType["HOMEWORK"] = "homework";
    AssessmentVersionType["SUPERVISED_HOMEWORK"] = "supervised_homework";
    AssessmentVersionType["TEST"] = "test";
    AssessmentVersionType["QUIZ"] = "quiz";
    AssessmentVersionType["MONTHLY_COMPOSITION"] = "monthly_composition";
    AssessmentVersionType["CONTINUOUS_ASSESSMENT"] = "continuous_assessment";
})(AssessmentVersionType || (exports.AssessmentVersionType = AssessmentVersionType = {}));
var VersionAction;
(function (VersionAction) {
    VersionAction["CREATED"] = "created";
    VersionAction["UPDATED"] = "updated";
    VersionAction["DELETED"] = "deleted";
    VersionAction["RESTORED"] = "restored";
})(VersionAction || (exports.VersionAction = VersionAction = {}));
let AssessmentVersion = class AssessmentVersion {
    id;
    assessmentId;
    versionNumber;
    versionAction;
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
    changedBy;
    changeReason;
    changedFields;
    createdAt;
    assessment;
    user;
};
exports.AssessmentVersion = AssessmentVersion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AssessmentVersion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], AssessmentVersion.prototype, "assessmentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer' }),
    __metadata("design:type", Number)
], AssessmentVersion.prototype, "versionNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: VersionAction,
    }),
    __metadata("design:type", String)
], AssessmentVersion.prototype, "versionAction", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], AssessmentVersion.prototype, "termId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], AssessmentVersion.prototype, "classSubjectId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], AssessmentVersion.prototype, "schoolYearId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AssessmentVersionType,
    }),
    __metadata("design:type", String)
], AssessmentVersion.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], AssessmentVersion.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssessmentVersion.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], AssessmentVersion.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], AssessmentVersion.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], AssessmentVersion.prototype, "maxScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], AssessmentVersion.prototype, "weight", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], AssessmentVersion.prototype, "changedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssessmentVersion.prototype, "changeReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], AssessmentVersion.prototype, "changedFields", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AssessmentVersion.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => assessment_entity_1.Assessment, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'assessment_id' }),
    __metadata("design:type", assessment_entity_1.Assessment)
], AssessmentVersion.prototype, "assessment", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'changed_by' }),
    __metadata("design:type", user_entity_1.User)
], AssessmentVersion.prototype, "user", void 0);
exports.AssessmentVersion = AssessmentVersion = __decorate([
    (0, typeorm_1.Entity)('assessment_versions'),
    (0, typeorm_1.Index)(['assessmentId', 'versionNumber'], { unique: true }),
    (0, typeorm_1.Index)(['assessmentId', 'createdAt'])
], AssessmentVersion);
//# sourceMappingURL=assessment-version.entity.js.map