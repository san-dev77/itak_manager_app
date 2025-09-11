import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AssessmentVersion,
  VersionAction,
} from '../../entities/assessment-version.entity';
import { Assessment } from '../../entities/assessment.entity';

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
  ): Promise<AssessmentVersion> {
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
      type: assessment.type,
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

    return await this.assessmentVersionRepository.save(version);
  }

  /**
   * Get all versions for an assessment
   */
  async getAssessmentVersions(
    assessmentId: string,
  ): Promise<AssessmentVersion[]> {
    return await this.assessmentVersionRepository.find({
      where: { assessmentId },
      order: { versionNumber: 'DESC' },
      relations: ['user'],
    });
  }

  /**
   * Get a specific version of an assessment
   */
  async getVersion(
    assessmentId: string,
    versionNumber: number,
  ): Promise<AssessmentVersion> {
    const version = await this.assessmentVersionRepository.findOne({
      where: { assessmentId, versionNumber },
      relations: ['user'],
    });

    if (!version) {
      throw new NotFoundException(
        `Version ${versionNumber} for assessment ${assessmentId} not found`,
      );
    }

    return version;
  }

  /**
   * Get the latest version of an assessment
   */
  async getLatestVersion(assessmentId: string): Promise<AssessmentVersion> {
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

    return version;
  }

  /**
   * Compare two versions of an assessment
   */
  async compareVersions(
    assessmentId: string,
    fromVersion: number,
    toVersion: number,
  ): Promise<{
    from: AssessmentVersion;
    to: AssessmentVersion;
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
    assessment.type = version.type;
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
}
