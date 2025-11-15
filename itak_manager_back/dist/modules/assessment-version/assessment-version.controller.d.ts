import { AssessmentVersionService } from './assessment-version.service';
import { CreateVersionDto } from './dto/create-version.dto';
import { RestoreVersionDto } from './dto/restore-version.dto';
import { VersionResponseDto, VersionComparisonDto, VersionStatsDto } from './dto/version-response.dto';
export declare class AssessmentVersionController {
    private readonly assessmentVersionService;
    constructor(assessmentVersionService: AssessmentVersionService);
    createVersion(createVersionDto: CreateVersionDto): Promise<VersionResponseDto>;
    getAssessmentVersions(assessmentId: string): Promise<VersionResponseDto[]>;
    getVersion(assessmentId: string, versionNumber: number): Promise<VersionResponseDto>;
    getLatestVersion(assessmentId: string): Promise<VersionResponseDto>;
    compareVersions(assessmentId: string, fromVersion: number, toVersion: number): Promise<VersionComparisonDto>;
    restoreToVersion(assessmentId: string, restoreVersionDto: RestoreVersionDto): Promise<import("../../entities/assessment.entity").Assessment>;
    getVersionStats(assessmentId: string): Promise<VersionStatsDto>;
    cleanupOldVersions(assessmentId: string, keepVersions?: number): Promise<{
        deletedCount: number;
    }>;
}
