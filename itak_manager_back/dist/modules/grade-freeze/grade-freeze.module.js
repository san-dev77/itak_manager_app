"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GradeFreezeModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const grade_freeze_service_1 = require("./grade-freeze.service");
const grade_freeze_controller_1 = require("./grade-freeze.controller");
const grade_freeze_period_entity_1 = require("../../entities/grade-freeze-period.entity");
let GradeFreezeModule = class GradeFreezeModule {
};
exports.GradeFreezeModule = GradeFreezeModule;
exports.GradeFreezeModule = GradeFreezeModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([grade_freeze_period_entity_1.GradeFreezePeriod])],
        controllers: [grade_freeze_controller_1.GradeFreezeController],
        providers: [grade_freeze_service_1.GradeFreezeService],
        exports: [grade_freeze_service_1.GradeFreezeService],
    })
], GradeFreezeModule);
//# sourceMappingURL=grade-freeze.module.js.map