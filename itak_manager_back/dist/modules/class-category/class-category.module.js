"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassCategoryModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const class_category_controller_1 = require("./class-category.controller");
const class_category_service_1 = require("./class-category.service");
const class_category_entity_1 = require("../../entities/class-category.entity");
let ClassCategoryModule = class ClassCategoryModule {
};
exports.ClassCategoryModule = ClassCategoryModule;
exports.ClassCategoryModule = ClassCategoryModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([class_category_entity_1.ClassCategory])],
        controllers: [class_category_controller_1.ClassCategoryController],
        providers: [class_category_service_1.ClassCategoryService],
        exports: [class_category_service_1.ClassCategoryService],
    })
], ClassCategoryModule);
//# sourceMappingURL=class-category.module.js.map