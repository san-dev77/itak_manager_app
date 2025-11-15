"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GradeFreezeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const grade_freeze_period_entity_1 = require("../../entities/grade-freeze-period.entity");
const bcrypt = __importStar(require("bcrypt"));
let GradeFreezeService = class GradeFreezeService {
    gradeFreezeRepository;
    constructor(gradeFreezeRepository) {
        this.gradeFreezeRepository = gradeFreezeRepository;
    }
    async createFreezePeriod(schoolYearId, title, description, scope, startDate, endDate, createdBy, termId, classId, allowEmergencyOverride, overridePassword) {
        if (scope === grade_freeze_period_entity_1.FreezeScope.TERM_SPECIFIC && !termId) {
            throw new common_1.BadRequestException('Term ID is required for term-specific freeze periods');
        }
        if (scope === grade_freeze_period_entity_1.FreezeScope.CLASS_SPECIFIC && !classId) {
            throw new common_1.BadRequestException('Class ID is required for class-specific freeze periods');
        }
        if (startDate >= endDate) {
            throw new common_1.BadRequestException('End date must be after start date');
        }
        const overlapping = await this.checkOverlappingPeriods(schoolYearId, startDate, endDate, scope, termId, classId);
        if (overlapping.length > 0) {
            throw new common_1.BadRequestException(`Overlapping freeze period found: ${overlapping[0].title}`);
        }
        let hashedPassword = undefined;
        if (overridePassword) {
            hashedPassword = await bcrypt.hash(overridePassword, 10);
        }
        const freezePeriod = this.gradeFreezeRepository.create({
            schoolYearId,
            termId,
            classId,
            title,
            description,
            scope,
            startDate,
            endDate,
            createdBy,
            allowEmergencyOverride: allowEmergencyOverride || false,
            overridePassword: hashedPassword,
            status: grade_freeze_period_entity_1.FreezeStatus.SCHEDULED,
        });
        return await this.gradeFreezeRepository.save(freezePeriod);
    }
    async checkOverlappingPeriods(schoolYearId, startDate, endDate, scope, termId, classId, excludeId) {
        const query = this.gradeFreezeRepository
            .createQueryBuilder('freeze')
            .where('freeze.schoolYearId = :schoolYearId', { schoolYearId })
            .andWhere('freeze.status IN (:...statuses)', {
            statuses: [grade_freeze_period_entity_1.FreezeStatus.SCHEDULED, grade_freeze_period_entity_1.FreezeStatus.ACTIVE],
        })
            .andWhere('(freeze.startDate <= :endDate AND freeze.endDate >= :startDate)', { startDate, endDate });
        if (excludeId) {
            query.andWhere('freeze.id != :excludeId', { excludeId });
        }
        if (scope === grade_freeze_period_entity_1.FreezeScope.SCHOOL_WIDE) {
            return await query.getMany();
        }
        else if (scope === grade_freeze_period_entity_1.FreezeScope.TERM_SPECIFIC) {
            query.andWhere('(freeze.scope = :schoolWide OR (freeze.scope = :termSpecific AND freeze.termId = :termId))', {
                schoolWide: grade_freeze_period_entity_1.FreezeScope.SCHOOL_WIDE,
                termSpecific: grade_freeze_period_entity_1.FreezeScope.TERM_SPECIFIC,
                termId,
            });
        }
        else if (scope === grade_freeze_period_entity_1.FreezeScope.CLASS_SPECIFIC) {
            query.andWhere('(freeze.scope = :schoolWide OR (freeze.scope = :termSpecific AND freeze.termId = :termId) OR (freeze.scope = :classSpecific AND freeze.classId = :classId))', {
                schoolWide: grade_freeze_period_entity_1.FreezeScope.SCHOOL_WIDE,
                termSpecific: grade_freeze_period_entity_1.FreezeScope.TERM_SPECIFIC,
                classSpecific: grade_freeze_period_entity_1.FreezeScope.CLASS_SPECIFIC,
                termId,
                classId,
            });
        }
        return await query.getMany();
    }
    async getFreezePeriods(schoolYearId, status, scope, termId, classId) {
        const query = this.gradeFreezeRepository.createQueryBuilder('freeze');
        if (schoolYearId) {
            query.andWhere('freeze.schoolYearId = :schoolYearId', { schoolYearId });
        }
        if (status) {
            query.andWhere('freeze.status = :status', { status });
        }
        if (scope) {
            query.andWhere('freeze.scope = :scope', { scope });
        }
        if (termId) {
            query.andWhere('freeze.termId = :termId', { termId });
        }
        if (classId) {
            query.andWhere('freeze.classId = :classId', { classId });
        }
        return await query
            .leftJoinAndSelect('freeze.schoolYear', 'schoolYear')
            .leftJoinAndSelect('freeze.term', 'term')
            .leftJoinAndSelect('freeze.class', 'class')
            .leftJoinAndSelect('freeze.creator', 'creator')
            .leftJoinAndSelect('freeze.approver', 'approver')
            .orderBy('freeze.startDate', 'DESC')
            .getMany();
    }
    async getFreezePeriodById(id) {
        const freezePeriod = await this.gradeFreezeRepository.findOne({
            where: { id },
            relations: [
                'schoolYear',
                'term',
                'class',
                'creator',
                'approver',
                'canceller',
            ],
        });
        if (!freezePeriod) {
            throw new common_1.NotFoundException(`Grade freeze period with ID ${id} not found`);
        }
        return freezePeriod;
    }
    async isGradeFrozen(schoolYearId, termId, classId) {
        const now = new Date();
        const query = this.gradeFreezeRepository
            .createQueryBuilder('freeze')
            .where('freeze.schoolYearId = :schoolYearId', { schoolYearId })
            .andWhere('freeze.status = :status', { status: grade_freeze_period_entity_1.FreezeStatus.ACTIVE })
            .andWhere('freeze.startDate <= :now', { now })
            .andWhere('freeze.endDate >= :now', { now });
        if (classId) {
            query.andWhere('(freeze.scope = :classSpecific AND freeze.classId = :classId) OR (freeze.scope = :termSpecific AND freeze.termId = :termId) OR freeze.scope = :schoolWide', {
                classSpecific: grade_freeze_period_entity_1.FreezeScope.CLASS_SPECIFIC,
                termSpecific: grade_freeze_period_entity_1.FreezeScope.TERM_SPECIFIC,
                schoolWide: grade_freeze_period_entity_1.FreezeScope.SCHOOL_WIDE,
                classId,
                termId,
            });
        }
        else if (termId) {
            query.andWhere('(freeze.scope = :termSpecific AND freeze.termId = :termId) OR freeze.scope = :schoolWide', {
                termSpecific: grade_freeze_period_entity_1.FreezeScope.TERM_SPECIFIC,
                schoolWide: grade_freeze_period_entity_1.FreezeScope.SCHOOL_WIDE,
                termId,
            });
        }
        else {
            query.andWhere('freeze.scope = :schoolWide', {
                schoolWide: grade_freeze_period_entity_1.FreezeScope.SCHOOL_WIDE,
            });
        }
        const freezePeriod = await query
            .orderBy('freeze.scope', 'DESC')
            .getOne();
        return {
            isFrozen: !!freezePeriod,
            freezePeriod: freezePeriod || undefined,
            canOverride: freezePeriod?.allowEmergencyOverride || false,
        };
    }
    async verifyOverridePassword(freezePeriodId, password) {
        const freezePeriod = await this.getFreezePeriodById(freezePeriodId);
        if (!freezePeriod.allowEmergencyOverride ||
            !freezePeriod.overridePassword) {
            return false;
        }
        return await bcrypt.compare(password, freezePeriod.overridePassword);
    }
    async approveFreezePeriod(id, approvedBy) {
        const freezePeriod = await this.getFreezePeriodById(id);
        if (freezePeriod.status !== grade_freeze_period_entity_1.FreezeStatus.SCHEDULED) {
            throw new common_1.BadRequestException('Only scheduled freeze periods can be approved');
        }
        freezePeriod.approvedBy = approvedBy;
        freezePeriod.approvedAt = new Date();
        return await this.gradeFreezeRepository.save(freezePeriod);
    }
    async cancelFreezePeriod(id, cancelledBy, reason) {
        const freezePeriod = await this.getFreezePeriodById(id);
        if (freezePeriod.status === grade_freeze_period_entity_1.FreezeStatus.COMPLETED) {
            throw new common_1.BadRequestException('Cannot cancel completed freeze periods');
        }
        freezePeriod.status = grade_freeze_period_entity_1.FreezeStatus.CANCELLED;
        freezePeriod.cancelledBy = cancelledBy;
        freezePeriod.cancelledAt = new Date();
        freezePeriod.cancellationReason = reason;
        return await this.gradeFreezeRepository.save(freezePeriod);
    }
    async activateScheduledPeriods() {
        const now = new Date();
        const periodsToActivate = await this.gradeFreezeRepository.find({
            where: {
                status: grade_freeze_period_entity_1.FreezeStatus.SCHEDULED,
                startDate: (0, typeorm_2.LessThanOrEqual)(now),
                endDate: (0, typeorm_2.MoreThanOrEqual)(now),
            },
        });
        for (const period of periodsToActivate) {
            period.status = grade_freeze_period_entity_1.FreezeStatus.ACTIVE;
        }
        return await this.gradeFreezeRepository.save(periodsToActivate);
    }
    async completeExpiredPeriods() {
        const now = new Date();
        const periodsToComplete = await this.gradeFreezeRepository.find({
            where: {
                status: grade_freeze_period_entity_1.FreezeStatus.ACTIVE,
                endDate: (0, typeorm_2.LessThanOrEqual)(now),
            },
        });
        for (const period of periodsToComplete) {
            period.status = grade_freeze_period_entity_1.FreezeStatus.COMPLETED;
        }
        return await this.gradeFreezeRepository.save(periodsToComplete);
    }
    async updateFreezePeriod(id, updates) {
        const freezePeriod = await this.getFreezePeriodById(id);
        if (freezePeriod.status === grade_freeze_period_entity_1.FreezeStatus.ACTIVE) {
            throw new common_1.BadRequestException('Cannot update active freeze periods');
        }
        if (freezePeriod.status === grade_freeze_period_entity_1.FreezeStatus.COMPLETED) {
            throw new common_1.BadRequestException('Cannot update completed freeze periods');
        }
        if (updates.startDate || updates.endDate) {
            const startDate = updates.startDate || freezePeriod.startDate;
            const endDate = updates.endDate || freezePeriod.endDate;
            if (startDate >= endDate) {
                throw new common_1.BadRequestException('End date must be after start date');
            }
            const overlapping = await this.checkOverlappingPeriods(freezePeriod.schoolYearId, startDate, endDate, updates.scope || freezePeriod.scope, updates.termId || freezePeriod.termId, updates.classId || freezePeriod.classId, id);
            if (overlapping.length > 0) {
                throw new common_1.BadRequestException(`Overlapping freeze period found: ${overlapping[0].title}`);
            }
        }
        if (updates.overridePassword) {
            updates.overridePassword = await bcrypt.hash(updates.overridePassword, 10);
        }
        Object.assign(freezePeriod, updates);
        return await this.gradeFreezeRepository.save(freezePeriod);
    }
    async deleteFreezePeriod(id) {
        const freezePeriod = await this.getFreezePeriodById(id);
        if (freezePeriod.status === grade_freeze_period_entity_1.FreezeStatus.ACTIVE) {
            throw new common_1.BadRequestException('Cannot delete active freeze periods');
        }
        await this.gradeFreezeRepository.delete(id);
    }
};
exports.GradeFreezeService = GradeFreezeService;
exports.GradeFreezeService = GradeFreezeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(grade_freeze_period_entity_1.GradeFreezePeriod)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GradeFreezeService);
//# sourceMappingURL=grade-freeze.service.js.map