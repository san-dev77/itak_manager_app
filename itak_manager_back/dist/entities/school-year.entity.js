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
exports.SchoolYear = void 0;
const typeorm_1 = require("typeorm");
const term_entity_1 = require("./term.entity");
const assessment_entity_1 = require("./assessment.entity");
let SchoolYear = class SchoolYear {
    id;
    name;
    startDate;
    endDate;
    isActive;
    createdAt;
    updatedAt;
    terms;
    assessments;
};
exports.SchoolYear = SchoolYear;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SchoolYear.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, unique: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], SchoolYear.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], SchoolYear.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], SchoolYear.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Boolean)
], SchoolYear.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], SchoolYear.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], SchoolYear.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => term_entity_1.Term, (term) => term.schoolYear),
    __metadata("design:type", Array)
], SchoolYear.prototype, "terms", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => assessment_entity_1.Assessment, (assessment) => assessment.schoolYear),
    __metadata("design:type", Array)
], SchoolYear.prototype, "assessments", void 0);
exports.SchoolYear = SchoolYear = __decorate([
    (0, typeorm_1.Entity)('school_years')
], SchoolYear);
//# sourceMappingURL=school-year.entity.js.map