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
exports.Teacher = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const teaching_assignment_entity_1 = require("./teaching-assignment.entity");
const subject_entity_1 = require("./subject.entity");
let Teacher = class Teacher {
    id;
    userId;
    matricule;
    hireDate;
    photo;
    maritalStatus;
    diplomas;
    address;
    emergencyContact;
    notes;
    createdAt;
    updatedAt;
    user;
    teachingAssignments;
    subjects;
};
exports.Teacher = Teacher;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Teacher.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', unique: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Teacher.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, unique: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Teacher.prototype, "matricule", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], Teacher.prototype, "hireDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Teacher.prototype, "photo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], Teacher.prototype, "maritalStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Teacher.prototype, "diplomas", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Teacher.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Teacher.prototype, "emergencyContact", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Teacher.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Teacher.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Teacher.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.teachers, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Teacher.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => teaching_assignment_entity_1.TeachingAssignment, (assignment) => assignment.teacher),
    __metadata("design:type", Array)
], Teacher.prototype, "teachingAssignments", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => subject_entity_1.Subject, (subject) => subject.teachers),
    (0, typeorm_1.JoinTable)({
        name: 'teacher_subjects',
        joinColumn: {
            name: 'teacher_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'subject_id',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], Teacher.prototype, "subjects", void 0);
exports.Teacher = Teacher = __decorate([
    (0, typeorm_1.Entity)('teachers')
], Teacher);
//# sourceMappingURL=teacher.entity.js.map