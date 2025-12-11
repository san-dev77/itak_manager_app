import { AssessmentType } from '../../../entities/assessment.entity';
import { VersionAction } from '../../../entities/assessment-version.entity';

export class VersionResponseDto {
  id: string;
  assessmentId: string;
  versionNumber: number;
  versionAction: VersionAction;

  // Assessment data snapshot
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

  // Version metadata
  changedBy: string;
  changeReason: string;
  changedFields: string[];
  createdAt: Date;

  // Related data
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
}

export class VersionComparisonDto {
  from: VersionResponseDto;
  to: VersionResponseDto;
  differences: Array<{
    field: string;
    fromValue: any;
    toValue: any;
  }>;
}

export class VersionStatsDto {
  totalVersions: number;
  createdVersions: number;
  updatedVersions: number;
  deletedVersions: number;
  restoredVersions: number;
  firstVersion: Date;
  lastVersion: Date;
}
