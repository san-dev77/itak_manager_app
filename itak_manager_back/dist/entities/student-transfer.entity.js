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
exports.StudentTransfer = exports.TransferReason = void 0;
const typeorm_1 = require("typeorm");
const student_entity_1 = require("./student.entity");
const class_entity_1 = require("./class.entity");
var TransferReason;
(function (TransferReason) {
    TransferReason["DISCIPLINARY"] = "disciplinary";
    TransferReason["ACADEMIC"] = "academic";
    TransferReason["MEDICAL"] = "medical";
    TransferReason["FAMILY_REQUEST"] = "family_request";
    TransferReason["ADMINISTRATIVE"] = "administrative";
    TransferReason["CAPACITY_ADJUSTMENT"] = "capacity_adjustment";
})(TransferReason || (exports.TransferReason = TransferReason = {}));
let StudentTransfer = class StudentTransfer {
    id;
    studentId;
    fromClassId;
    toClassId;
    transferDate;
    reason;
    reasonDetails;
    year;
    approvedBy;
    approvalDate;
    createdAt;
    updatedAt;
    student;
    fromClass;
    toClass;
};
exports.StudentTransfer = StudentTransfer;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], StudentTransfer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], StudentTransfer.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], StudentTransfer.prototype, "fromClassId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], StudentTransfer.prototype, "toClassId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], StudentTransfer.prototype, "transferDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TransferReason,
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], StudentTransfer.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], StudentTransfer.prototype, "reasonDetails", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 9 }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], StudentTransfer.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], StudentTransfer.prototype, "approvedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], StudentTransfer.prototype, "approvalDate", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], StudentTransfer.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], StudentTransfer.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => student_entity_1.Student, (student) => student.transfers, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'student_id' }),
    __metadata("design:type", student_entity_1.Student)
], StudentTransfer.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => class_entity_1.Class, (classEntity) => classEntity.transfersFrom, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'from_class_id' }),
    __metadata("design:type", class_entity_1.Class)
], StudentTransfer.prototype, "fromClass", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => class_entity_1.Class, (classEntity) => classEntity.transfersTo, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'to_class_id' }),
    __metadata("design:type", class_entity_1.Class)
], StudentTransfer.prototype, "toClass", void 0);
exports.StudentTransfer = StudentTransfer = __decorate([
    (0, typeorm_1.Entity)('student_transfers'),
    (0, typeorm_1.Check)('chk_different_classes', 'from_class_id != to_class_id'),
    (0, typeorm_1.Check)('chk_transfer_date_not_future', 'transfer_date <= CURRENT_DATE')
], StudentTransfer);
//# sourceMappingURL=student-transfer.entity.js.map