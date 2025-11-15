import { SchoolYear } from './school-year.entity';
import { Term } from './term.entity';
import { Class } from './class.entity';
import { User } from './user.entity';
export declare enum FreezeScope {
    SCHOOL_WIDE = "school_wide",
    TERM_SPECIFIC = "term_specific",
    CLASS_SPECIFIC = "class_specific"
}
export declare enum FreezeStatus {
    SCHEDULED = "scheduled",
    ACTIVE = "active",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare class GradeFreezePeriod {
    id: string;
    schoolYearId: string;
    termId: string;
    classId: string;
    title: string;
    description: string;
    scope: FreezeScope;
    status: FreezeStatus;
    startDate: Date;
    endDate: Date;
    createdBy: string;
    approvedBy: string;
    approvedAt: Date;
    cancelledBy: string;
    cancelledAt: Date;
    cancellationReason: string;
    allowEmergencyOverride: boolean;
    overridePassword: string;
    createdAt: Date;
    updatedAt: Date;
    schoolYear: SchoolYear;
    term: Term;
    class: Class;
    creator: User;
    approver: User;
    canceller: User;
}
