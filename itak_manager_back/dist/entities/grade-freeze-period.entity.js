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
exports.GradeFreezePeriod = exports.FreezeStatus = exports.FreezeScope = void 0;
const typeorm_1 = require("typeorm");
const school_year_entity_1 = require("./school-year.entity");
const term_entity_1 = require("./term.entity");
const class_entity_1 = require("./class.entity");
const user_entity_1 = require("./user.entity");
var FreezeScope;
(function (FreezeScope) {
    FreezeScope["SCHOOL_WIDE"] = "school_wide";
    FreezeScope["TERM_SPECIFIC"] = "term_specific";
    FreezeScope["CLASS_SPECIFIC"] = "class_specific";
})(FreezeScope || (exports.FreezeScope = FreezeScope = {}));
var FreezeStatus;
(function (FreezeStatus) {
    FreezeStatus["SCHEDULED"] = "scheduled";
    FreezeStatus["ACTIVE"] = "active";
    FreezeStatus["COMPLETED"] = "completed";
    FreezeStatus["CANCELLED"] = "cancelled";
})(FreezeStatus || (exports.FreezeStatus = FreezeStatus = {}));
let GradeFreezePeriod = class GradeFreezePeriod {
    id;
    schoolYearId;
    termId;
    classId;
    title;
    description;
    scope;
    status;
    startDate;
    endDate;
    createdBy;
    approvedBy;
    approvedAt;
    cancelledBy;
    cancelledAt;
    cancellationReason;
    allowEmergencyOverride;
    overridePassword;
    createdAt;
    updatedAt;
    schoolYear;
    term;
    class;
    creator;
    approver;
    canceller;
};
exports.GradeFreezePeriod = GradeFreezePeriod;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], GradeFreezePeriod.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], GradeFreezePeriod.prototype, "schoolYearId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], GradeFreezePeriod.prototype, "termId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], GradeFreezePeriod.prototype, "classId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], GradeFreezePeriod.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], GradeFreezePeriod.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: FreezeScope,
        default: FreezeScope.SCHOOL_WIDE,
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], GradeFreezePeriod.prototype, "scope", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: FreezeStatus,
        default: FreezeStatus.SCHEDULED,
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], GradeFreezePeriod.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], GradeFreezePeriod.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], GradeFreezePeriod.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], GradeFreezePeriod.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], GradeFreezePeriod.prototype, "approvedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], GradeFreezePeriod.prototype, "approvedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], GradeFreezePeriod.prototype, "cancelledBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], GradeFreezePeriod.prototype, "cancelledAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], GradeFreezePeriod.prototype, "cancellationReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], GradeFreezePeriod.prototype, "allowEmergencyOverride", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 255,
        nullable: true,
    }),
    __metadata("design:type", String)
], GradeFreezePeriod.prototype, "overridePassword", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], GradeFreezePeriod.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], GradeFreezePeriod.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => school_year_entity_1.SchoolYear, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'school_year_id' }),
    __metadata("design:type", school_year_entity_1.SchoolYear)
], GradeFreezePeriod.prototype, "schoolYear", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => term_entity_1.Term, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'term_id' }),
    __metadata("design:type", term_entity_1.Term)
], GradeFreezePeriod.prototype, "term", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => class_entity_1.Class, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'class_id' }),
    __metadata("design:type", class_entity_1.Class)
], GradeFreezePeriod.prototype, "class", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], GradeFreezePeriod.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'approved_by' }),
    __metadata("design:type", user_entity_1.User)
], GradeFreezePeriod.prototype, "approver", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'cancelled_by' }),
    __metadata("design:type", user_entity_1.User)
], GradeFreezePeriod.prototype, "canceller", void 0);
exports.GradeFreezePeriod = GradeFreezePeriod = __decorate([
    (0, typeorm_1.Entity)('grade_freeze_periods'),
    (0, typeorm_1.Index)(['schoolYearId', 'startDate', 'endDate']),
    (0, typeorm_1.Index)(['status', 'scope']),
    (0, typeorm_1.Check)('chk_end_date_after_start', 'end_date > start_date')
], GradeFreezePeriod);
//# sourceMappingURL=grade-freeze-period.entity.js.map