import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AssessmentVersion,
  AssessmentVersionType,
  VersionAction,
} from '../../entities/assessment-version.entity';
import { Assessment, AssessmentType } from '../../entities/assessment.entity';
import { VersionResponseDto } from './dto/version-response.dto';

@Injectable()
export class AssessmentVersionService {
  constructor(
    @InjectRepository(AssessmentVersion)
    private assessmentVersionRepository: Repository<AssessmentVersion>,
    @InjectRepository(Assessment)
    private assessmentRepository: Repository<Assessment>,
  ) {}

  /**
   * Create a new version snapshot of an assessment
   */
  async createVersion(
    assessmentId: string,
    action: VersionAction,
    changedBy: string,
    changeReason?: string,
    changedFields?: string[],
  ): Promise<VersionResponseDto> {
    // Get the current assessment data
    const assessment = await this.assessmentRepository.findOne({
      where: { id: assessmentId },
    });

    if (!assessment) {
      throw new NotFoundException(
        `Assessment with ID ${assessmentId} not found`,
      );
    }

    // Get the next version number
    const lastVersion = await this.assessmentVersionRepository.findOne({
      where: { assessmentId },
      order: { versionNumber: 'DESC' },
    });

    const versionNumber = lastVersion ? lastVersion.versionNumber + 1 : 1;

    // Create version snapshot
    const version = this.assessmentVersionRepository.create({
      assessmentId,
      versionNumber,
      versionAction: action,
      termId: assessment.termId,
      classSubjectId: assessment.classSubjectId,
      schoolYearId: assessment.schoolYearId,
      type: assessment.type as unknown as AssessmentVersionType,
      title: assessment.title,
      description: assessment.description,
      startDate: assessment.startDate,
      endDate: assessment.endDate,
      maxScore: assessment.maxScore,
      weight: assessment.weight,
      changedBy,
      changeReason,
      changedFields,
    });

    const savedVersion = await this.assessmentVersionRepository.save(version);
    return this.toVersionResponseDto(savedVersion);
  }

  /**
   * Get all versions for an assessment
   */
  async getAssessmentVersions(
    assessmentId: string,
  ): Promise<VersionResponseDto[]> {
    const versions = await this.assessmentVersionRepository.find({
      where: { assessmentId },
      order: { versionNumber: 'DESC' },
      relations: ['user'],
    });
    return versions.map((version) => this.toVersionResponseDto(version));
  }

  /**
   * Get a specific version of an assessment
   */
  async getVersion(
    assessmentId: string,
    versionNumber: number,
  ): Promise<VersionResponseDto> {
    const version = await this.assessmentVersionRepository.findOne({
      where: { assessmentId, versionNumber },
      relations: ['user'],
    });

    if (!version) {
      throw new NotFoundException(
        `Version ${versionNumber} for assessment ${assessmentId} not found`,
      );
    }

    return this.toVersionResponseDto(version);
  }

  /**
   * Get the latest version of an assessment
   */
  async getLatestVersion(assessmentId: string): Promise<VersionResponseDto> {
    const version = await this.assessmentVersionRepository.findOne({
      where: { assessmentId },
      order: { versionNumber: 'DESC' },
      relations: ['user'],
    });

    if (!version) {
      throw new NotFoundException(
        `No versions found for assessment ${assessmentId}`,
      );
    }

    return this.toVersionResponseDto(version);
  }

  /**
   * Compare two versions of an assessment
   */
  async compareVersions(
    assessmentId: string,
    fromVersion: number,
    toVersion: number,
  ): Promise<{
    from: VersionResponseDto;
    to: VersionResponseDto;
    differences: Array<{
      field: string;
      fromValue: any;
      toValue: any;
    }>;
  }> {
    const [from, to] = await Promise.all([
      this.getVersion(assessmentId, fromVersion),
      this.getVersion(assessmentId, toVersion),
    ]);

    const differences: Array<{
      field: string;
      fromValue: any;
      toValue: any;
    }> = [];
    const fieldsToCompare = [
      'termId',
      'classSubjectId',
      'schoolYearId',
      'type',
      'title',
      'description',
      'startDate',
      'endDate',
      'maxScore',
      'weight',
    ];

    for (const field of fieldsToCompare) {
      const fromValue = from[field];
      const toValue = to[field];

      if (JSON.stringify(fromValue) !== JSON.stringify(toValue)) {
        differences.push({
          field,
          fromValue,
          toValue,
        });
      }
    }

    return { from, to, differences };
  }

  /**
   * Restore an assessment to a specific version
   */
  async restoreToVersion(
    assessmentId: string,
    versionNumber: number,
    restoredBy: string,
    restoreReason?: string,
  ): Promise<Assessment> {
    const version = await this.getVersion(assessmentId, versionNumber);
    const assessment = await this.assessmentRepository.findOne({
      where: { id: assessmentId },
    });

    if (!assessment) {
      throw new NotFoundException(
        `Assessment with ID ${assessmentId} not found`,
      );
    }

    // Update assessment with version data
    assessment.termId = version.termId;
    assessment.classSubjectId = version.classSubjectId;
    assessment.schoolYearId = version.schoolYearId;
    assessment.type = version.type as unknown as AssessmentType;
    assessment.title = version.title;
    assessment.description = version.description;
    assessment.startDate = version.startDate;
    assessment.endDate = version.endDate;
    assessment.maxScore = version.maxScore;
    assessment.weight = version.weight;

    const updatedAssessment = await this.assessmentRepository.save(assessment);

    // Create a new version entry for the restore action
    await this.createVersion(
      assessmentId,
      VersionAction.RESTORED,
      restoredBy,
      `Restored to version ${versionNumber}. ${restoreReason || ''}`.trim(),
    );

    return updatedAssessment;
  }

  /**
   * Get version statistics for an assessment
   */
  async getVersionStats(assessmentId: string): Promise<{
    totalVersions: number;
    createdVersions: number;
    updatedVersions: number;
    deletedVersions: number;
    restoredVersions: number;
    firstVersion: Date;
    lastVersion: Date;
  }> {
    const versions = await this.assessmentVersionRepository.find({
      where: { assessmentId },
      order: { createdAt: 'ASC' },
    });

    if (versions.length === 0) {
      throw new NotFoundException(
        `No versions found for assessment ${assessmentId}`,
      );
    }

    const stats = {
      totalVersions: versions.length,
      createdVersions: versions.filter(
        (v) => v.versionAction === VersionAction.CREATED,
      ).length,
      updatedVersions: versions.filter(
        (v) => v.versionAction === VersionAction.UPDATED,
      ).length,
      deletedVersions: versions.filter(
        (v) => v.versionAction === VersionAction.DELETED,
      ).length,
      restoredVersions: versions.filter(
        (v) => v.versionAction === VersionAction.RESTORED,
      ).length,
      firstVersion: versions[0].createdAt,
      lastVersion: versions[versions.length - 1].createdAt,
    };

    return stats;
  }

  /**
   * Delete old versions (keep only the last N versions)
   */
  async cleanupOldVersions(
    assessmentId: string,
    keepVersions: number = 10,
  ): Promise<number> {
    const versions = await this.assessmentVersionRepository.find({
      where: { assessmentId },
      order: { versionNumber: 'DESC' },
    });

    if (versions.length <= keepVersions) {
      return 0;
    }

    const versionsToDelete = versions.slice(keepVersions);
    const versionIds = versionsToDelete.map((v) => v.id);

    await this.assessmentVersionRepository.delete(versionIds);

    return versionsToDelete.length;
  }

  private toVersionResponseDto(version: AssessmentVersion): VersionResponseDto {
    return {
      id: version.id,
      assessmentId: version.assessmentId,
      versionNumber: version.versionNumber,
      versionAction: version.versionAction,
      termId: version.termId,
      classSubjectId: version.classSubjectId,
      schoolYearId: version.schoolYearId,
      type: version.type as unknown as AssessmentType,
      title: version.title,
      description: version.description,
      startDate: version.startDate,
      endDate: version.endDate,
      maxScore: version.maxScore,
      weight: version.weight,
      changedBy: version.changedBy,
      changeReason: version.changeReason,
      changedFields: version.changedFields,
      createdAt: version.createdAt,
      user: {
        id: version.user.id,
        firstName: version.user.firstName,
        lastName: version.user.lastName,
        email: version.user.email,
      },
    };
  }
}
