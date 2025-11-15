import { VersionAction } from '../../../entities/assessment-version.entity';
export declare class CreateVersionDto {
    assessmentId: string;
    action: VersionAction;
    changedBy: string;
    changeReason?: string;
    changedFields?: string[];
}
