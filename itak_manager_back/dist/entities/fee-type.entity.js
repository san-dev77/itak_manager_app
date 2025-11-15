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
exports.FeeType = exports.FeeFrequency = void 0;
const typeorm_1 = require("typeorm");
const student_fee_entity_1 = require("./student-fee.entity");
var FeeFrequency;
(function (FeeFrequency) {
    FeeFrequency["ONCE"] = "once";
    FeeFrequency["MONTHLY"] = "monthly";
    FeeFrequency["QUARTERLY"] = "quarterly";
    FeeFrequency["YEARLY"] = "yearly";
})(FeeFrequency || (exports.FeeFrequency = FeeFrequency = {}));
let FeeType = class FeeType {
    id;
    name;
    description;
    amountDefault;
    isRecurring;
    frequency;
    createdAt;
    updatedAt;
    studentFees;
};
exports.FeeType = FeeType;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], FeeType.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: false, unique: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], FeeType.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], FeeType.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 12,
        scale: 2,
        nullable: false,
    }),
    __metadata("design:type", Number)
], FeeType.prototype, "amountDefault", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], FeeType.prototype, "isRecurring", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: FeeFrequency,
        nullable: true,
    }),
    __metadata("design:type", String)
], FeeType.prototype, "frequency", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], FeeType.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], FeeType.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => student_fee_entity_1.StudentFee, (studentFee) => studentFee.feeType),
    __metadata("design:type", Array)
], FeeType.prototype, "studentFees", void 0);
exports.FeeType = FeeType = __decorate([
    (0, typeorm_1.Entity)('fee_types')
], FeeType);
//# sourceMappingURL=fee-type.entity.js.map