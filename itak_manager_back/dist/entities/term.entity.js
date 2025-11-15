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
exports.Term = void 0;
const typeorm_1 = require("typeorm");
const school_year_entity_1 = require("./school-year.entity");
const assessment_entity_1 = require("./assessment.entity");
let Term = class Term {
    id;
    schoolYearId;
    name;
    startDate;
    endDate;
    isActive;
    orderNumber;
    createdAt;
    updatedAt;
    schoolYear;
    assessments;
};
exports.Term = Term;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Term.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Term.prototype, "schoolYearId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20 }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Term.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], Term.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], Term.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Boolean)
], Term.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], Term.prototype, "orderNumber", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Term.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Term.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => school_year_entity_1.SchoolYear, (schoolYear) => schoolYear.terms, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'schoolYearId' }),
    __metadata("design:type", school_year_entity_1.SchoolYear)
], Term.prototype, "schoolYear", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => assessment_entity_1.Assessment, (assessment) => assessment.term),
    __metadata("design:type", Array)
], Term.prototype, "assessments", void 0);
exports.Term = Term = __decorate([
    (0, typeorm_1.Entity)('terms')
], Term);
//# sourceMappingURL=term.entity.js.map