import { Assessment } from './assessment.entity';
import { User } from './user.entity';
export declare enum AssessmentVersionType {
    EXAM = "exam",
    HOMEWORK = "homework",
    SUPERVISED_HOMEWORK = "supervised_homework",
    TEST = "test",
    QUIZ = "quiz",
    MONTHLY_COMPOSITION = "monthly_composition",
    CONTINUOUS_ASSESSMENT = "continuous_assessment"
}
export declare enum VersionAction {
    CREATED = "created",
    UPDATED = "updated",
    DELETED = "deleted",
    RESTORED = "restored"
}
export declare class AssessmentVersion {
    id: string;
    assessmentId: string;
    versionNumber: number;
    versionAction: VersionAction;
    termId: string;
    classSubjectId: string;
    schoolYearId: string;
    type: AssessmentVersionType;
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
    assessment: Assessment;
    user: User;
}
