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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GradeCalculationController = void 0;
const common_1 = require("@nestjs/common");
const grade_calculation_service_1 = require("./grade-calculation.service");
let GradeCalculationController = class GradeCalculationController {
    gradeCalculationService;
    constructor(gradeCalculationService) {
        this.gradeCalculationService = gradeCalculationService;
    }
    async getStudentTermGrades(studentId, termId) {
        return this.gradeCalculationService.calculateTermGrades(studentId, termId);
    }
    async getStudentYearGrades(studentId, schoolYearId) {
        return this.gradeCalculationService.calculateYearGrades(studentId, schoolYearId);
    }
    async getClassAverages(classId, termId) {
        return this.gradeCalculationService.calculateClassAverages(classId, termId);
    }
};
exports.GradeCalculationController = GradeCalculationController;
__decorate([
    (0, common_1.Get)('student/:studentId/term/:termId'),
    __param(0, (0, common_1.Param)('studentId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('termId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GradeCalculationController.prototype, "getStudentTermGrades", null);
__decorate([
    (0, common_1.Get)('student/:studentId/year/:schoolYearId'),
    __param(0, (0, common_1.Param)('studentId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('schoolYearId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GradeCalculationController.prototype, "getStudentYearGrades", null);
__decorate([
    (0, common_1.Get)('class/:classId/term/:termId/averages'),
    __param(0, (0, common_1.Param)('classId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('termId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GradeCalculationController.prototype, "getClassAverages", null);
exports.GradeCalculationController = GradeCalculationController = __decorate([
    (0, common_1.Controller)('grade-calculation'),
    __metadata("design:paramtypes", [grade_calculation_service_1.GradeCalculationService])
], GradeCalculationController);
//# sourceMappingURL=grade-calculation.controller.js.map