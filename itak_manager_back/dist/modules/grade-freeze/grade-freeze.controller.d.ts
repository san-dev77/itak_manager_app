import { GradeFreezeService } from './grade-freeze.service';
import { CreateFreezePeriodDto } from './dto/create-freeze-period.dto';
import { UpdateFreezePeriodDto } from './dto/update-freeze-period.dto';
import { FreezePeriodResponseDto, FreezeStatusCheckDto, ApproveFreezePeriodDto, CancelFreezePeriodDto, VerifyOverrideDto } from './dto/freeze-period-response.dto';
import { FreezeScope, FreezeStatus } from '../../entities/grade-freeze-period.entity';
export declare class GradeFreezeController {
    private readonly gradeFreezeService;
    constructor(gradeFreezeService: GradeFreezeService);
    createFreezePeriod(createFreezePeriodDto: CreateFreezePeriodDto): Promise<FreezePeriodResponseDto>;
    getFreezePeriods(schoolYearId?: string, status?: FreezeStatus, scope?: FreezeScope, termId?: string, classId?: string): Promise<FreezePeriodResponseDto[]>;
    getFreezePeriodById(id: string): Promise<FreezePeriodResponseDto>;
    checkFreezeStatus(schoolYearId: string, termId?: string, classId?: string): Promise<FreezeStatusCheckDto>;
    approveFreezePeriod(id: string, approveDto: ApproveFreezePeriodDto): Promise<FreezePeriodResponseDto>;
    cancelFreezePeriod(id: string, cancelDto: CancelFreezePeriodDto): Promise<FreezePeriodResponseDto>;
    verifyOverridePassword(id: string, verifyDto: VerifyOverrideDto): Promise<{
        isValid: boolean;
    }>;
    updateFreezePeriod(id: string, updateFreezePeriodDto: UpdateFreezePeriodDto): Promise<FreezePeriodResponseDto>;
    deleteFreezePeriod(id: string): Promise<{
        message: string;
    }>;
    activateScheduledPeriods(): Promise<{
        activated: number;
        periods: FreezePeriodResponseDto[];
    }>;
    completeExpiredPeriods(): Promise<{
        completed: number;
        periods: FreezePeriodResponseDto[];
    }>;
}
