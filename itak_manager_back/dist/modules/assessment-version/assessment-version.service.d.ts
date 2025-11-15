import { Repository } from 'typeorm';
import { AssessmentVersion, VersionAction } from '../../entities/assessment-version.entity';
import { Assessment } from '../../entities/assessment.entity';
import { VersionResponseDto } from './dto/version-response.dto';
export declare class AssessmentVersionService {
    private assessmentVersionRepository;
    private assessmentRepository;
    constructor(assessmentVersionRepository: Repository<AssessmentVersion>, assessmentRepository: Repository<Assessment>);
    createVersion(assessmentId: string, action: VersionAction, changedBy: string, changeReason?: string, changedFields?: string[]): Promise<VersionResponseDto>;
    getAssessmentVersions(assessmentId: string): Promise<VersionResponseDto[]>;
    getVersion(assessmentId: string, versionNumber: number): Promise<VersionResponseDto>;
    getLatestVersion(assessmentId: string): Promise<VersionResponseDto>;
    compareVersions(assessmentId: string, fromVersion: number, toVersion: number): Promise<{
        from: VersionResponseDto;
        to: VersionResponseDto;
        differences: Array<{
            field: string;
            fromValue: any;
            toValue: any;
        }>;
    }>;
    restoreToVersion(assessmentId: string, versionNumber: number, restoredBy: string, restoreReason?: string): Promise<Assessment>;
    getVersionStats(assessmentId: string): Promise<{
        totalVersions: number;
        createdVersions: number;
        updatedVersions: number;
        deletedVersions: number;
        restoredVersions: number;
        firstVersion: Date;
        lastVersion: Date;
    }>;
    cleanupOldVersions(assessmentId: string, keepVersions?: number): Promise<number>;
    private toVersionResponseDto;
}
