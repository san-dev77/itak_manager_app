import { AssessmentType } from '../../../entities/assessment.entity';
import { VersionAction } from '../../../entities/assessment-version.entity';
export declare class VersionResponseDto {
    id: string;
    assessmentId: string;
    versionNumber: number;
    versionAction: VersionAction;
    termId: string;
    classSubjectId: string;
    schoolYearId: string;
    type: AssessmentType;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    maxScore: number;
    weight: number;
    changedBy: string;
    changeReason: string;
    changedFields: string[];
    createdAt: Date;
    user?: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
}
export declare class VersionComparisonDto {
    from: VersionResponseDto;
    to: VersionResponseDto;
    differences: Array<{
        field: string;
        fromValue: any;
        toValue: any;
    }>;
}
export declare class VersionStatsDto {
    totalVersions: number;
    createdVersions: number;
    updatedVersions: number;
    deletedVersions: number;
    restoredVersions: number;
    firstVersion: Date;
    lastVersion: Date;
}
