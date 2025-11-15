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
exports.StudentParent = exports.RelationshipType = void 0;
const typeorm_1 = require("typeorm");
const student_entity_1 = require("./student.entity");
const parent_entity_1 = require("./parent.entity");
var RelationshipType;
(function (RelationshipType) {
    RelationshipType["FATHER"] = "p\u00E8re";
    RelationshipType["MOTHER"] = "m\u00E8re";
    RelationshipType["GUARDIAN"] = "tuteur";
    RelationshipType["STEPFATHER"] = "beau-p\u00E8re";
    RelationshipType["STEPMOTHER"] = "belle-m\u00E8re";
    RelationshipType["GRANDFATHER"] = "grand-p\u00E8re";
    RelationshipType["GRANDMOTHER"] = "grand-m\u00E8re";
    RelationshipType["OTHER"] = "autre";
})(RelationshipType || (exports.RelationshipType = RelationshipType = {}));
let StudentParent = class StudentParent {
    id;
    studentId;
    parentId;
    relationship;
    createdAt;
    updatedAt;
    student;
    parent;
};
exports.StudentParent = StudentParent;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], StudentParent.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], StudentParent.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], StudentParent.prototype, "parentId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: RelationshipType,
        default: RelationshipType.FATHER,
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], StudentParent.prototype, "relationship", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], StudentParent.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], StudentParent.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => student_entity_1.Student, (student) => student.studentParents, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'student_id' }),
    __metadata("design:type", student_entity_1.Student)
], StudentParent.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => parent_entity_1.Parent, (parent) => parent.studentParents, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'parent_id' }),
    __metadata("design:type", parent_entity_1.Parent)
], StudentParent.prototype, "parent", void 0);
exports.StudentParent = StudentParent = __decorate([
    (0, typeorm_1.Entity)('student_parents'),
    (0, typeorm_1.Unique)(['studentId', 'parentId'])
], StudentParent);
//# sourceMappingURL=student-parent.entity.js.map