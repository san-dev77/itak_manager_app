import { Repository } from 'typeorm';
import { GradeFreezePeriod, FreezeScope, FreezeStatus } from '../../entities/grade-freeze-period.entity';
export declare class GradeFreezeService {
    private gradeFreezeRepository;
    constructor(gradeFreezeRepository: Repository<GradeFreezePeriod>);
    createFreezePeriod(schoolYearId: string, title: string, description: string | undefined, scope: FreezeScope, startDate: Date, endDate: Date, createdBy: string, termId?: string, classId?: string, allowEmergencyOverride?: boolean, overridePassword?: string): Promise<GradeFreezePeriod>;
    private checkOverlappingPeriods;
    getFreezePeriods(schoolYearId?: string, status?: FreezeStatus, scope?: FreezeScope, termId?: string, classId?: string): Promise<GradeFreezePeriod[]>;
    getFreezePeriodById(id: string): Promise<GradeFreezePeriod>;
    isGradeFrozen(schoolYearId: string, termId?: string, classId?: string): Promise<{
        isFrozen: boolean;
        freezePeriod?: GradeFreezePeriod;
        canOverride: boolean;
    }>;
    verifyOverridePassword(freezePeriodId: string, password: string): Promise<boolean>;
    approveFreezePeriod(id: string, approvedBy: string): Promise<GradeFreezePeriod>;
    cancelFreezePeriod(id: string, cancelledBy: string, reason: string): Promise<GradeFreezePeriod>;
    activateScheduledPeriods(): Promise<GradeFreezePeriod[]>;
    completeExpiredPeriods(): Promise<GradeFreezePeriod[]>;
    updateFreezePeriod(id: string, updates: Partial<GradeFreezePeriod>): Promise<GradeFreezePeriod>;
    deleteFreezePeriod(id: string): Promise<void>;
}
