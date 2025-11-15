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
exports.GradeFreezeController = void 0;
const common_1 = require("@nestjs/common");
const grade_freeze_service_1 = require("./grade-freeze.service");
const create_freeze_period_dto_1 = require("./dto/create-freeze-period.dto");
const update_freeze_period_dto_1 = require("./dto/update-freeze-period.dto");
const freeze_period_response_dto_1 = require("./dto/freeze-period-response.dto");
const grade_freeze_period_entity_1 = require("../../entities/grade-freeze-period.entity");
let GradeFreezeController = class GradeFreezeController {
    gradeFreezeService;
    constructor(gradeFreezeService) {
        this.gradeFreezeService = gradeFreezeService;
    }
    async createFreezePeriod(createFreezePeriodDto) {
        return await this.gradeFreezeService.createFreezePeriod(createFreezePeriodDto.schoolYearId, createFreezePeriodDto.title, createFreezePeriodDto.description || undefined, createFreezePeriodDto.scope, new Date(createFreezePeriodDto.startDate), new Date(createFreezePeriodDto.endDate), createFreezePeriodDto.createdBy, createFreezePeriodDto.termId, createFreezePeriodDto.classId, createFreezePeriodDto.allowEmergencyOverride, createFreezePeriodDto.overridePassword);
    }
    async getFreezePeriods(schoolYearId, status, scope, termId, classId) {
        return await this.gradeFreezeService.getFreezePeriods(schoolYearId, status, scope, termId, classId);
    }
    async getFreezePeriodById(id) {
        return await this.gradeFreezeService.getFreezePeriodById(id);
    }
    async checkFreezeStatus(schoolYearId, termId, classId) {
        return await this.gradeFreezeService.isGradeFrozen(schoolYearId, termId, classId);
    }
    async approveFreezePeriod(id, approveDto) {
        return await this.gradeFreezeService.approveFreezePeriod(id, approveDto.approvedBy);
    }
    async cancelFreezePeriod(id, cancelDto) {
        return await this.gradeFreezeService.cancelFreezePeriod(id, cancelDto.cancelledBy, cancelDto.reason);
    }
    async verifyOverridePassword(id, verifyDto) {
        const isValid = await this.gradeFreezeService.verifyOverridePassword(id, verifyDto.password);
        return { isValid };
    }
    async updateFreezePeriod(id, updateFreezePeriodDto) {
        const updates = {};
        if (updateFreezePeriodDto.title)
            updates.title = updateFreezePeriodDto.title;
        if (updateFreezePeriodDto.description)
            updates.description = updateFreezePeriodDto.description;
        if (updateFreezePeriodDto.scope)
            updates.scope = updateFreezePeriodDto.scope;
        if (updateFreezePeriodDto.startDate)
            updates.startDate = new Date(updateFreezePeriodDto.startDate);
        if (updateFreezePeriodDto.endDate)
            updates.endDate = new Date(updateFreezePeriodDto.endDate);
        if (updateFreezePeriodDto.termId)
            updates.termId = updateFreezePeriodDto.termId;
        if (updateFreezePeriodDto.classId)
            updates.classId = updateFreezePeriodDto.classId;
        if (updateFreezePeriodDto.allowEmergencyOverride !== undefined) {
            updates.allowEmergencyOverride =
                updateFreezePeriodDto.allowEmergencyOverride;
        }
        if (updateFreezePeriodDto.overridePassword) {
            updates.overridePassword = updateFreezePeriodDto.overridePassword;
        }
        return await this.gradeFreezeService.updateFreezePeriod(id, updates);
    }
    async deleteFreezePeriod(id) {
        await this.gradeFreezeService.deleteFreezePeriod(id);
        return { message: 'Freeze period deleted successfully' };
    }
    async activateScheduledPeriods() {
        const periods = await this.gradeFreezeService.activateScheduledPeriods();
        return {
            activated: periods.length,
            periods,
        };
    }
    async completeExpiredPeriods() {
        const periods = await this.gradeFreezeService.completeExpiredPeriods();
        return {
            completed: periods.length,
            periods,
        };
    }
};
exports.GradeFreezeController = GradeFreezeController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_freeze_period_dto_1.CreateFreezePeriodDto]),
    __metadata("design:returntype", Promise)
], GradeFreezeController.prototype, "createFreezePeriod", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('schoolYearId')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('scope')),
    __param(3, (0, common_1.Query)('termId')),
    __param(4, (0, common_1.Query)('classId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], GradeFreezeController.prototype, "getFreezePeriods", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GradeFreezeController.prototype, "getFreezePeriodById", null);
__decorate([
    (0, common_1.Get)('check/status'),
    __param(0, (0, common_1.Query)('schoolYearId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('termId')),
    __param(2, (0, common_1.Query)('classId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], GradeFreezeController.prototype, "checkFreezeStatus", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, freeze_period_response_dto_1.ApproveFreezePeriodDto]),
    __metadata("design:returntype", Promise)
], GradeFreezeController.prototype, "approveFreezePeriod", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, freeze_period_response_dto_1.CancelFreezePeriodDto]),
    __metadata("design:returntype", Promise)
], GradeFreezeController.prototype, "cancelFreezePeriod", null);
__decorate([
    (0, common_1.Post)(':id/verify-override'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, freeze_period_response_dto_1.VerifyOverrideDto]),
    __metadata("design:returntype", Promise)
], GradeFreezeController.prototype, "verifyOverridePassword", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_freeze_period_dto_1.UpdateFreezePeriodDto]),
    __metadata("design:returntype", Promise)
], GradeFreezeController.prototype, "updateFreezePeriod", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GradeFreezeController.prototype, "deleteFreezePeriod", null);
__decorate([
    (0, common_1.Post)('activate-scheduled'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GradeFreezeController.prototype, "activateScheduledPeriods", null);
__decorate([
    (0, common_1.Post)('complete-expired'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GradeFreezeController.prototype, "completeExpiredPeriods", null);
exports.GradeFreezeController = GradeFreezeController = __decorate([
    (0, common_1.Controller)('grade-freeze'),
    __metadata("design:paramtypes", [grade_freeze_service_1.GradeFreezeService])
], GradeFreezeController);
//# sourceMappingURL=grade-freeze.controller.js.map