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
exports.StudentFee = exports.FeeStatus = void 0;
const typeorm_1 = require("typeorm");
const student_entity_1 = require("./student.entity");
const fee_type_entity_1 = require("./fee-type.entity");
const payment_entity_1 = require("./payment.entity");
const school_year_entity_1 = require("./school-year.entity");
const discount_entity_1 = require("./discount.entity");
const invoice_item_entity_1 = require("./invoice-item.entity");
var FeeStatus;
(function (FeeStatus) {
    FeeStatus["PENDING"] = "pending";
    FeeStatus["PARTIAL"] = "partial";
    FeeStatus["PAID"] = "paid";
    FeeStatus["OVERDUE"] = "overdue";
})(FeeStatus || (exports.FeeStatus = FeeStatus = {}));
let StudentFee = class StudentFee {
    id;
    studentId;
    feeTypeId;
    academicYearId;
    amountAssigned;
    dueDate;
    status;
    createdAt;
    updatedAt;
    student;
    feeType;
    academicYear;
    payments;
    discounts;
    invoiceItems;
    get amountPaid() {
        if (!this.payments)
            return 0;
        return this.payments
            .filter((payment) => payment.status === payment_entity_1.PaymentStatus.SUCCESSFUL)
            .reduce((sum, payment) => sum + Number(payment.amount), 0);
    }
};
exports.StudentFee = StudentFee;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], StudentFee.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], StudentFee.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], StudentFee.prototype, "feeTypeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], StudentFee.prototype, "academicYearId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 12,
        scale: 2,
        nullable: false,
    }),
    __metadata("design:type", Number)
], StudentFee.prototype, "amountAssigned", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], StudentFee.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: FeeStatus,
        default: FeeStatus.PENDING,
    }),
    __metadata("design:type", String)
], StudentFee.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], StudentFee.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], StudentFee.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => student_entity_1.Student, (student) => student.studentFees, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'student_id' }),
    __metadata("design:type", student_entity_1.Student)
], StudentFee.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => fee_type_entity_1.FeeType, (feeType) => feeType.studentFees, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'fee_type_id' }),
    __metadata("design:type", fee_type_entity_1.FeeType)
], StudentFee.prototype, "feeType", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => school_year_entity_1.SchoolYear, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'academic_year_id' }),
    __metadata("design:type", school_year_entity_1.SchoolYear)
], StudentFee.prototype, "academicYear", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => payment_entity_1.Payment, (payment) => payment.studentFee),
    __metadata("design:type", Array)
], StudentFee.prototype, "payments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => discount_entity_1.Discount, (discount) => discount.studentFee),
    __metadata("design:type", Array)
], StudentFee.prototype, "discounts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => invoice_item_entity_1.InvoiceItem, (invoiceItem) => invoiceItem.studentFee),
    __metadata("design:type", Array)
], StudentFee.prototype, "invoiceItems", void 0);
exports.StudentFee = StudentFee = __decorate([
    (0, typeorm_1.Entity)('student_fees')
], StudentFee);
//# sourceMappingURL=student-fee.entity.js.map