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
exports.Class = void 0;
const typeorm_1 = require("typeorm");
const class_subject_entity_1 = require("./class-subject.entity");
const student_class_entity_1 = require("./student-class.entity");
const class_category_entity_1 = require("./class-category.entity");
const student_transfer_entity_1 = require("./student-transfer.entity");
let Class = class Class {
    id;
    name;
    code;
    description;
    level;
    categoryId;
    capacity;
    orderLevel;
    createdAt;
    updatedAt;
    classCategory;
    classSubjects;
    studentClasses;
    transfersFrom;
    transfersTo;
};
exports.Class = Class;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Class.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Class.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, unique: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Class.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Class.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], Class.prototype, "level", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Class.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Class.prototype, "capacity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], Class.prototype, "orderLevel", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Class.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Class.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => class_category_entity_1.ClassCategory, (classCategory) => classCategory.classes),
    __metadata("design:type", class_category_entity_1.ClassCategory)
], Class.prototype, "classCategory", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => class_subject_entity_1.ClassSubject, (classSubject) => classSubject.class),
    __metadata("design:type", Array)
], Class.prototype, "classSubjects", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => student_class_entity_1.StudentClass, (studentClass) => studentClass.class),
    __metadata("design:type", Array)
], Class.prototype, "studentClasses", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => student_transfer_entity_1.StudentTransfer, (transfer) => transfer.fromClass),
    __metadata("design:type", Array)
], Class.prototype, "transfersFrom", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => student_transfer_entity_1.StudentTransfer, (transfer) => transfer.toClass),
    __metadata("design:type", Array)
], Class.prototype, "transfersTo", void 0);
exports.Class = Class = __decorate([
    (0, typeorm_1.Entity)('classes')
], Class);
//# sourceMappingURL=class.entity.js.map