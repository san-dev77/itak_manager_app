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
exports.StudentClass = exports.StudentClassStatus = void 0;
const typeorm_1 = require("typeorm");
const student_entity_1 = require("./student.entity");
const class_entity_1 = require("./class.entity");
var StudentClassStatus;
(function (StudentClassStatus) {
    StudentClassStatus["ACTIVE"] = "active";
    StudentClassStatus["TRANSFERRED"] = "transferred";
    StudentClassStatus["REPEATING"] = "repeating";
    StudentClassStatus["GRADUATED"] = "graduated";
    StudentClassStatus["DROPPED"] = "dropped";
})(StudentClassStatus || (exports.StudentClassStatus = StudentClassStatus = {}));
let StudentClass = class StudentClass {
    id;
    studentId;
    classId;
    startDate;
    endDate;
    status;
    year;
    createdAt;
    updatedAt;
    student;
    class;
};
exports.StudentClass = StudentClass;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], StudentClass.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], StudentClass.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], StudentClass.prototype, "classId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], StudentClass.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], StudentClass.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: StudentClassStatus,
        default: StudentClassStatus.ACTIVE,
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], StudentClass.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 9 }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], StudentClass.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], StudentClass.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], StudentClass.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => student_entity_1.Student, (student) => student.studentClasses, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'student_id' }),
    __metadata("design:type", student_entity_1.Student)
], StudentClass.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => class_entity_1.Class, (classEntity) => classEntity.studentClasses, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'class_id' }),
    __metadata("design:type", class_entity_1.Class)
], StudentClass.prototype, "class", void 0);
exports.StudentClass = StudentClass = __decorate([
    (0, typeorm_1.Entity)('student_classes'),
    (0, typeorm_1.Unique)(['studentId', 'classId']),
    (0, typeorm_1.Check)('chk_start_date_not_future', 'start_date <= CURRENT_DATE'),
    (0, typeorm_1.Check)('chk_end_date_after_start', 'end_date IS NULL OR end_date >= start_date')
], StudentClass);
//# sourceMappingURL=student-class.entity.js.map