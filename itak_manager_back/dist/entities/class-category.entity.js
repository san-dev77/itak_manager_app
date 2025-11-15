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
exports.ClassCategory = void 0;
const typeorm_1 = require("typeorm");
const class_entity_1 = require("./class.entity");
let ClassCategory = class ClassCategory {
    id;
    name;
    createdAt;
    updatedAt;
    classes;
};
exports.ClassCategory = ClassCategory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ClassCategory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, unique: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], ClassCategory.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], ClassCategory.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], ClassCategory.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => class_entity_1.Class, (class_) => class_.classCategory),
    __metadata("design:type", Array)
], ClassCategory.prototype, "classes", void 0);
exports.ClassCategory = ClassCategory = __decorate([
    (0, typeorm_1.Entity)('class_category')
], ClassCategory);
//# sourceMappingURL=class-category.entity.js.map