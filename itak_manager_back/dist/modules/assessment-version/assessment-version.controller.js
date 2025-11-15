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
exports.AssessmentVersionController = void 0;
const common_1 = require("@nestjs/common");
const assessment_version_service_1 = require("./assessment-version.service");
const create_version_dto_1 = require("./dto/create-version.dto");
const restore_version_dto_1 = require("./dto/restore-version.dto");
let AssessmentVersionController = class AssessmentVersionController {
    assessmentVersionService;
    constructor(assessmentVersionService) {
        this.assessmentVersionService = assessmentVersionService;
    }
    async createVersion(createVersionDto) {
        const version = await this.assessmentVersionService.createVersion(createVersionDto.assessmentId, createVersionDto.action, createVersionDto.changedBy, createVersionDto.changeReason, createVersionDto.changedFields);
        return version;
    }
    async getAssessmentVersions(assessmentId) {
        return await this.assessmentVersionService.getAssessmentVersions(assessmentId);
    }
    async getVersion(assessmentId, versionNumber) {
        return await this.assessmentVersionService.getVersion(assessmentId, versionNumber);
    }
    async getLatestVersion(assessmentId) {
        return await this.assessmentVersionService.getLatestVersion(assessmentId);
    }
    async compareVersions(assessmentId, fromVersion, toVersion) {
        return await this.assessmentVersionService.compareVersions(assessmentId, fromVersion, toVersion);
    }
    async restoreToVersion(assessmentId, restoreVersionDto) {
        return await this.assessmentVersionService.restoreToVersion(assessmentId, restoreVersionDto.versionNumber, restoreVersionDto.restoredBy, restoreVersionDto.restoreReason);
    }
    async getVersionStats(assessmentId) {
        return await this.assessmentVersionService.getVersionStats(assessmentId);
    }
    async cleanupOldVersions(assessmentId, keepVersions = 10) {
        const deletedCount = await this.assessmentVersionService.cleanupOldVersions(assessmentId, keepVersions);
        return { deletedCount };
    }
};
exports.AssessmentVersionController = AssessmentVersionController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_version_dto_1.CreateVersionDto]),
    __metadata("design:returntype", Promise)
], AssessmentVersionController.prototype, "createVersion", null);
__decorate([
    (0, common_1.Get)('assessment/:assessmentId'),
    __param(0, (0, common_1.Param)('assessmentId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssessmentVersionController.prototype, "getAssessmentVersions", null);
__decorate([
    (0, common_1.Get)('assessment/:assessmentId/version/:versionNumber'),
    __param(0, (0, common_1.Param)('assessmentId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('versionNumber', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], AssessmentVersionController.prototype, "getVersion", null);
__decorate([
    (0, common_1.Get)('assessment/:assessmentId/latest'),
    __param(0, (0, common_1.Param)('assessmentId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssessmentVersionController.prototype, "getLatestVersion", null);
__decorate([
    (0, common_1.Get)('assessment/:assessmentId/compare'),
    __param(0, (0, common_1.Param)('assessmentId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('from', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('to', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], AssessmentVersionController.prototype, "compareVersions", null);
__decorate([
    (0, common_1.Put)('assessment/:assessmentId/restore'),
    __param(0, (0, common_1.Param)('assessmentId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, restore_version_dto_1.RestoreVersionDto]),
    __metadata("design:returntype", Promise)
], AssessmentVersionController.prototype, "restoreToVersion", null);
__decorate([
    (0, common_1.Get)('assessment/:assessmentId/stats'),
    __param(0, (0, common_1.Param)('assessmentId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssessmentVersionController.prototype, "getVersionStats", null);
__decorate([
    (0, common_1.Delete)('assessment/:assessmentId/cleanup'),
    __param(0, (0, common_1.Param)('assessmentId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('keep', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], AssessmentVersionController.prototype, "cleanupOldVersions", null);
exports.AssessmentVersionController = AssessmentVersionController = __decorate([
    (0, common_1.Controller)('assessment-versions'),
    __metadata("design:paramtypes", [assessment_version_service_1.AssessmentVersionService])
], AssessmentVersionController);
//# sourceMappingURL=assessment-version.controller.js.map