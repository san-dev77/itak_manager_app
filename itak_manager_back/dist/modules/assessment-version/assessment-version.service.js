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
exports.AssessmentVersionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const assessment_version_entity_1 = require("../../entities/assessment-version.entity");
const assessment_entity_1 = require("../../entities/assessment.entity");
let AssessmentVersionService = class AssessmentVersionService {
    assessmentVersionRepository;
    assessmentRepository;
    constructor(assessmentVersionRepository, assessmentRepository) {
        this.assessmentVersionRepository = assessmentVersionRepository;
        this.assessmentRepository = assessmentRepository;
    }
    async createVersion(assessmentId, action, changedBy, changeReason, changedFields) {
        const assessment = await this.assessmentRepository.findOne({
            where: { id: assessmentId },
        });
        if (!assessment) {
            throw new common_1.NotFoundException(`Assessment with ID ${assessmentId} not found`);
        }
        const lastVersion = await this.assessmentVersionRepository.findOne({
            where: { assessmentId },
            order: { versionNumber: 'DESC' },
        });
        const versionNumber = lastVersion ? lastVersion.versionNumber + 1 : 1;
        const version = this.assessmentVersionRepository.create({
            assessmentId,
            versionNumber,
            versionAction: action,
            termId: assessment.termId,
            classSubjectId: assessment.classSubjectId,
            schoolYearId: assessment.schoolYearId,
            type: assessment.type,
            title: assessment.title,
            description: assessment.description,
            startDate: assessment.startDate,
            endDate: assessment.endDate,
            maxScore: assessment.maxScore,
            weight: assessment.weight,
            changedBy,
            changeReason,
            changedFields,
        });
        const savedVersion = await this.assessmentVersionRepository.save(version);
        return this.toVersionResponseDto(savedVersion);
    }
    async getAssessmentVersions(assessmentId) {
        const versions = await this.assessmentVersionRepository.find({
            where: { assessmentId },
            order: { versionNumber: 'DESC' },
            relations: ['user'],
        });
        return versions.map((version) => this.toVersionResponseDto(version));
    }
    async getVersion(assessmentId, versionNumber) {
        const version = await this.assessmentVersionRepository.findOne({
            where: { assessmentId, versionNumber },
            relations: ['user'],
        });
        if (!version) {
            throw new common_1.NotFoundException(`Version ${versionNumber} for assessment ${assessmentId} not found`);
        }
        return this.toVersionResponseDto(version);
    }
    async getLatestVersion(assessmentId) {
        const version = await this.assessmentVersionRepository.findOne({
            where: { assessmentId },
            order: { versionNumber: 'DESC' },
            relations: ['user'],
        });
        if (!version) {
            throw new common_1.NotFoundException(`No versions found for assessment ${assessmentId}`);
        }
        return this.toVersionResponseDto(version);
    }
    async compareVersions(assessmentId, fromVersion, toVersion) {
        const [from, to] = await Promise.all([
            this.getVersion(assessmentId, fromVersion),
            this.getVersion(assessmentId, toVersion),
        ]);
        const differences = [];
        const fieldsToCompare = [
            'termId',
            'classSubjectId',
            'schoolYearId',
            'type',
            'title',
            'description',
            'startDate',
            'endDate',
            'maxScore',
            'weight',
        ];
        for (const field of fieldsToCompare) {
            const fromValue = from[field];
            const toValue = to[field];
            if (JSON.stringify(fromValue) !== JSON.stringify(toValue)) {
                differences.push({
                    field,
                    fromValue,
                    toValue,
                });
            }
        }
        return { from, to, differences };
    }
    async restoreToVersion(assessmentId, versionNumber, restoredBy, restoreReason) {
        const version = await this.getVersion(assessmentId, versionNumber);
        const assessment = await this.assessmentRepository.findOne({
            where: { id: assessmentId },
        });
        if (!assessment) {
            throw new common_1.NotFoundException(`Assessment with ID ${assessmentId} not found`);
        }
        assessment.termId = version.termId;
        assessment.classSubjectId = version.classSubjectId;
        assessment.schoolYearId = version.schoolYearId;
        assessment.type = version.type;
        assessment.title = version.title;
        assessment.description = version.description;
        assessment.startDate = version.startDate;
        assessment.endDate = version.endDate;
        assessment.maxScore = version.maxScore;
        assessment.weight = version.weight;
        const updatedAssessment = await this.assessmentRepository.save(assessment);
        await this.createVersion(assessmentId, assessment_version_entity_1.VersionAction.RESTORED, restoredBy, `Restored to version ${versionNumber}. ${restoreReason || ''}`.trim());
        return updatedAssessment;
    }
    async getVersionStats(assessmentId) {
        const versions = await this.assessmentVersionRepository.find({
            where: { assessmentId },
            order: { createdAt: 'ASC' },
        });
        if (versions.length === 0) {
            throw new common_1.NotFoundException(`No versions found for assessment ${assessmentId}`);
        }
        const stats = {
            totalVersions: versions.length,
            createdVersions: versions.filter((v) => v.versionAction === assessment_version_entity_1.VersionAction.CREATED).length,
            updatedVersions: versions.filter((v) => v.versionAction === assessment_version_entity_1.VersionAction.UPDATED).length,
            deletedVersions: versions.filter((v) => v.versionAction === assessment_version_entity_1.VersionAction.DELETED).length,
            restoredVersions: versions.filter((v) => v.versionAction === assessment_version_entity_1.VersionAction.RESTORED).length,
            firstVersion: versions[0].createdAt,
            lastVersion: versions[versions.length - 1].createdAt,
        };
        return stats;
    }
    async cleanupOldVersions(assessmentId, keepVersions = 10) {
        const versions = await this.assessmentVersionRepository.find({
            where: { assessmentId },
            order: { versionNumber: 'DESC' },
        });
        if (versions.length <= keepVersions) {
            return 0;
        }
        const versionsToDelete = versions.slice(keepVersions);
        const versionIds = versionsToDelete.map((v) => v.id);
        await this.assessmentVersionRepository.delete(versionIds);
        return versionsToDelete.length;
    }
    toVersionResponseDto(version) {
        return {
            id: version.id,
            assessmentId: version.assessmentId,
            versionNumber: version.versionNumber,
            versionAction: version.versionAction,
            termId: version.termId,
            classSubjectId: version.classSubjectId,
            schoolYearId: version.schoolYearId,
            type: version.type,
            title: version.title,
            description: version.description,
            startDate: version.startDate,
            endDate: version.endDate,
            maxScore: version.maxScore,
            weight: version.weight,
            changedBy: version.changedBy,
            changeReason: version.changeReason,
            changedFields: version.changedFields,
            createdAt: version.createdAt,
            user: {
                id: version.user.id,
                firstName: version.user.firstName,
                lastName: version.user.lastName,
                email: version.user.email,
            },
        };
    }
};
exports.AssessmentVersionService = AssessmentVersionService;
exports.AssessmentVersionService = AssessmentVersionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(assessment_version_entity_1.AssessmentVersion)),
    __param(1, (0, typeorm_1.InjectRepository)(assessment_entity_1.Assessment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AssessmentVersionService);
//# sourceMappingURL=assessment-version.service.js.map