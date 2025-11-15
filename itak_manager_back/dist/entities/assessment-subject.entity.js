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
exports.AssessmentSubject = exports.FileType = void 0;
const typeorm_1 = require("typeorm");
const assessment_entity_1 = require("./assessment.entity");
const user_entity_1 = require("./user.entity");
var FileType;
(function (FileType) {
    FileType["PDF"] = "pdf";
    FileType["DOC"] = "doc";
    FileType["DOCX"] = "docx";
    FileType["ODT"] = "odt";
})(FileType || (exports.FileType = FileType = {}));
let AssessmentSubject = class AssessmentSubject {
    id;
    assessmentId;
    fileUrl;
    fileType;
    uploadedBy;
    createdAt;
    updatedAt;
    assessment;
    uploadedByUser;
};
exports.AssessmentSubject = AssessmentSubject;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AssessmentSubject.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], AssessmentSubject.prototype, "assessmentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], AssessmentSubject.prototype, "fileUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: FileType,
    }),
    __metadata("design:type", String)
], AssessmentSubject.prototype, "fileType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], AssessmentSubject.prototype, "uploadedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AssessmentSubject.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], AssessmentSubject.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => assessment_entity_1.Assessment, (assessment) => assessment.subjects, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'assessment_id' }),
    __metadata("design:type", assessment_entity_1.Assessment)
], AssessmentSubject.prototype, "assessment", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.assessmentSubjects, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'uploaded_by' }),
    __metadata("design:type", user_entity_1.User)
], AssessmentSubject.prototype, "uploadedByUser", void 0);
exports.AssessmentSubject = AssessmentSubject = __decorate([
    (0, typeorm_1.Entity)('assessment_subjects')
], AssessmentSubject);
//# sourceMappingURL=assessment-subject.entity.js.map