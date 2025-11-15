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
exports.Discount = exports.DiscountType = void 0;
const typeorm_1 = require("typeorm");
const student_fee_entity_1 = require("./student-fee.entity");
const user_entity_1 = require("./user.entity");
var DiscountType;
(function (DiscountType) {
    DiscountType["SCHOLARSHIP"] = "scholarship";
    DiscountType["SIBLING_DISCOUNT"] = "sibling_discount";
    DiscountType["EXEMPTION"] = "exemption";
    DiscountType["OTHER"] = "other";
})(DiscountType || (exports.DiscountType = DiscountType = {}));
let Discount = class Discount {
    id;
    studentFeeId;
    type;
    description;
    amount;
    approvedBy;
    createdAt;
    updatedAt;
    studentFee;
    approvedByUser;
};
exports.Discount = Discount;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Discount.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Discount.prototype, "studentFeeId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: DiscountType,
        nullable: false,
    }),
    __metadata("design:type", String)
], Discount.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Discount.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, nullable: false }),
    __metadata("design:type", Number)
], Discount.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Discount.prototype, "approvedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Discount.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Discount.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => student_fee_entity_1.StudentFee, (studentFee) => studentFee.discounts, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'student_fee_id' }),
    __metadata("design:type", student_fee_entity_1.StudentFee)
], Discount.prototype, "studentFee", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.approvedDiscounts, {
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'approved_by' }),
    __metadata("design:type", user_entity_1.User)
], Discount.prototype, "approvedByUser", void 0);
exports.Discount = Discount = __decorate([
    (0, typeorm_1.Entity)('discounts')
], Discount);
//# sourceMappingURL=discount.entity.js.map