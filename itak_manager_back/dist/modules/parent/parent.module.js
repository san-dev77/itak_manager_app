"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParentModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const parent_controller_1 = require("./parent.controller");
const parent_service_1 = require("./parent.service");
const parent_entity_1 = require("../../entities/parent.entity");
const user_entity_1 = require("../../entities/user.entity");
const student_entity_1 = require("../../entities/student.entity");
const student_parent_entity_1 = require("../../entities/student-parent.entity");
let ParentModule = class ParentModule {
};
exports.ParentModule = ParentModule;
exports.ParentModule = ParentModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([parent_entity_1.Parent, user_entity_1.User, student_entity_1.Student, student_parent_entity_1.StudentParent])],
        controllers: [parent_controller_1.ParentController],
        providers: [parent_service_1.ParentService],
        exports: [parent_service_1.ParentService],
    })
], ParentModule);
//# sourceMappingURL=parent.module.js.map