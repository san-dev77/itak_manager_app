import { FreezeScope } from '../../../entities/grade-freeze-period.entity';
export declare class CreateFreezePeriodDto {
    schoolYearId: string;
    termId?: string;
    classId?: string;
    title: string;
    description?: string;
    scope: FreezeScope;
    startDate: string;
    endDate: string;
    createdBy: string;
    allowEmergencyOverride?: boolean;
    overridePassword?: string;
}
