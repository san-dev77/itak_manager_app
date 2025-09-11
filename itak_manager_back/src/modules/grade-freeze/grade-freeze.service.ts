import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import {
  GradeFreezePeriod,
  FreezeScope,
  FreezeStatus,
} from '../../entities/grade-freeze-period.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class GradeFreezeService {
  constructor(
    @InjectRepository(GradeFreezePeriod)
    private gradeFreezeRepository: Repository<GradeFreezePeriod>,
  ) {}

  /**
   * Create a new grade freeze period
   */
  async createFreezePeriod(
    schoolYearId: string,
    title: string,
    description: string | undefined,
    scope: FreezeScope,
    startDate: Date,
    endDate: Date,
    createdBy: string,
    termId?: string,
    classId?: string,
    allowEmergencyOverride?: boolean,
    overridePassword?: string,
  ): Promise<GradeFreezePeriod> {
    // Validate scope-specific requirements
    if (scope === FreezeScope.TERM_SPECIFIC && !termId) {
      throw new BadRequestException(
        'Term ID is required for term-specific freeze periods',
      );
    }
    if (scope === FreezeScope.CLASS_SPECIFIC && !classId) {
      throw new BadRequestException(
        'Class ID is required for class-specific freeze periods',
      );
    }

    // Validate dates
    if (startDate >= endDate) {
      throw new BadRequestException('End date must be after start date');
    }

    // Check for overlapping freeze periods
    const overlapping = await this.checkOverlappingPeriods(
      schoolYearId,
      startDate,
      endDate,
      scope,
      termId,
      classId,
    );

    if (overlapping.length > 0) {
      throw new BadRequestException(
        `Overlapping freeze period found: ${overlapping[0].title}`,
      );
    }

    // Hash override password if provided
    let hashedPassword: string | undefined = undefined;
    if (overridePassword) {
      hashedPassword = await bcrypt.hash(overridePassword, 10);
    }

    const freezePeriod = this.gradeFreezeRepository.create({
      schoolYearId,
      termId,
      classId,
      title,
      description,
      scope,
      startDate,
      endDate,
      createdBy,
      allowEmergencyOverride: allowEmergencyOverride || false,
      overridePassword: hashedPassword,
      status: FreezeStatus.SCHEDULED,
    });

    return await this.gradeFreezeRepository.save(freezePeriod);
  }

  /**
   * Check for overlapping freeze periods
   */
  private async checkOverlappingPeriods(
    schoolYearId: string,
    startDate: Date,
    endDate: Date,
    scope: FreezeScope,
    termId?: string,
    classId?: string,
    excludeId?: string,
  ): Promise<GradeFreezePeriod[]> {
    const query = this.gradeFreezeRepository
      .createQueryBuilder('freeze')
      .where('freeze.schoolYearId = :schoolYearId', { schoolYearId })
      .andWhere('freeze.status IN (:...statuses)', {
        statuses: [FreezeStatus.SCHEDULED, FreezeStatus.ACTIVE],
      })
      .andWhere(
        '(freeze.startDate <= :endDate AND freeze.endDate >= :startDate)',
        { startDate, endDate },
      );

    if (excludeId) {
      query.andWhere('freeze.id != :excludeId', { excludeId });
    }

    // Check scope-specific overlaps
    if (scope === FreezeScope.SCHOOL_WIDE) {
      // School-wide freezes conflict with everything
      return await query.getMany();
    } else if (scope === FreezeScope.TERM_SPECIFIC) {
      // Term-specific freezes conflict with school-wide and same term
      query.andWhere(
        '(freeze.scope = :schoolWide OR (freeze.scope = :termSpecific AND freeze.termId = :termId))',
        {
          schoolWide: FreezeScope.SCHOOL_WIDE,
          termSpecific: FreezeScope.TERM_SPECIFIC,
          termId,
        },
      );
    } else if (scope === FreezeScope.CLASS_SPECIFIC) {
      // Class-specific freezes conflict with school-wide, same term, and same class
      query.andWhere(
        '(freeze.scope = :schoolWide OR (freeze.scope = :termSpecific AND freeze.termId = :termId) OR (freeze.scope = :classSpecific AND freeze.classId = :classId))',
        {
          schoolWide: FreezeScope.SCHOOL_WIDE,
          termSpecific: FreezeScope.TERM_SPECIFIC,
          classSpecific: FreezeScope.CLASS_SPECIFIC,
          termId,
          classId,
        },
      );
    }

    return await query.getMany();
  }

  /**
   * Get all freeze periods with optional filtering
   */
  async getFreezePeriods(
    schoolYearId?: string,
    status?: FreezeStatus,
    scope?: FreezeScope,
    termId?: string,
    classId?: string,
  ): Promise<GradeFreezePeriod[]> {
    const query = this.gradeFreezeRepository.createQueryBuilder('freeze');

    if (schoolYearId) {
      query.andWhere('freeze.schoolYearId = :schoolYearId', { schoolYearId });
    }
    if (status) {
      query.andWhere('freeze.status = :status', { status });
    }
    if (scope) {
      query.andWhere('freeze.scope = :scope', { scope });
    }
    if (termId) {
      query.andWhere('freeze.termId = :termId', { termId });
    }
    if (classId) {
      query.andWhere('freeze.classId = :classId', { classId });
    }

    return await query
      .leftJoinAndSelect('freeze.schoolYear', 'schoolYear')
      .leftJoinAndSelect('freeze.term', 'term')
      .leftJoinAndSelect('freeze.class', 'class')
      .leftJoinAndSelect('freeze.creator', 'creator')
      .leftJoinAndSelect('freeze.approver', 'approver')
      .orderBy('freeze.startDate', 'DESC')
      .getMany();
  }

  /**
   * Get a specific freeze period by ID
   */
  async getFreezePeriodById(id: string): Promise<GradeFreezePeriod> {
    const freezePeriod = await this.gradeFreezeRepository.findOne({
      where: { id },
      relations: [
        'schoolYear',
        'term',
        'class',
        'creator',
        'approver',
        'canceller',
      ],
    });

    if (!freezePeriod) {
      throw new NotFoundException(
        `Grade freeze period with ID ${id} not found`,
      );
    }

    return freezePeriod;
  }

  /**
   * Check if grades are currently frozen for a specific context
   */
  async isGradeFrozen(
    schoolYearId: string,
    termId?: string,
    classId?: string,
  ): Promise<{
    isFrozen: boolean;
    freezePeriod?: GradeFreezePeriod;
    canOverride: boolean;
  }> {
    const now = new Date();

    const query = this.gradeFreezeRepository
      .createQueryBuilder('freeze')
      .where('freeze.schoolYearId = :schoolYearId', { schoolYearId })
      .andWhere('freeze.status = :status', { status: FreezeStatus.ACTIVE })
      .andWhere('freeze.startDate <= :now', { now })
      .andWhere('freeze.endDate >= :now', { now });

    // Check in order of specificity: class -> term -> school-wide
    if (classId) {
      query.andWhere(
        '(freeze.scope = :classSpecific AND freeze.classId = :classId) OR (freeze.scope = :termSpecific AND freeze.termId = :termId) OR freeze.scope = :schoolWide',
        {
          classSpecific: FreezeScope.CLASS_SPECIFIC,
          termSpecific: FreezeScope.TERM_SPECIFIC,
          schoolWide: FreezeScope.SCHOOL_WIDE,
          classId,
          termId,
        },
      );
    } else if (termId) {
      query.andWhere(
        '(freeze.scope = :termSpecific AND freeze.termId = :termId) OR freeze.scope = :schoolWide',
        {
          termSpecific: FreezeScope.TERM_SPECIFIC,
          schoolWide: FreezeScope.SCHOOL_WIDE,
          termId,
        },
      );
    } else {
      query.andWhere('freeze.scope = :schoolWide', {
        schoolWide: FreezeScope.SCHOOL_WIDE,
      });
    }

    const freezePeriod = await query
      .orderBy('freeze.scope', 'DESC') // Most specific first
      .getOne();

    return {
      isFrozen: !!freezePeriod,
      freezePeriod: freezePeriod || undefined,
      canOverride: freezePeriod?.allowEmergencyOverride || false,
    };
  }

  /**
   * Verify override password
   */
  async verifyOverridePassword(
    freezePeriodId: string,
    password: string,
  ): Promise<boolean> {
    const freezePeriod = await this.getFreezePeriodById(freezePeriodId);

    if (
      !freezePeriod.allowEmergencyOverride ||
      !freezePeriod.overridePassword
    ) {
      return false;
    }

    return await bcrypt.compare(password, freezePeriod.overridePassword);
  }

  /**
   * Approve a freeze period
   */
  async approveFreezePeriod(
    id: string,
    approvedBy: string,
  ): Promise<GradeFreezePeriod> {
    const freezePeriod = await this.getFreezePeriodById(id);

    if (freezePeriod.status !== FreezeStatus.SCHEDULED) {
      throw new BadRequestException(
        'Only scheduled freeze periods can be approved',
      );
    }

    freezePeriod.approvedBy = approvedBy;
    freezePeriod.approvedAt = new Date();

    return await this.gradeFreezeRepository.save(freezePeriod);
  }

  /**
   * Cancel a freeze period
   */
  async cancelFreezePeriod(
    id: string,
    cancelledBy: string,
    reason: string,
  ): Promise<GradeFreezePeriod> {
    const freezePeriod = await this.getFreezePeriodById(id);

    if (freezePeriod.status === FreezeStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel completed freeze periods');
    }

    freezePeriod.status = FreezeStatus.CANCELLED;
    freezePeriod.cancelledBy = cancelledBy;
    freezePeriod.cancelledAt = new Date();
    freezePeriod.cancellationReason = reason;

    return await this.gradeFreezeRepository.save(freezePeriod);
  }

  /**
   * Activate freeze periods that should be active now
   */
  async activateScheduledPeriods(): Promise<GradeFreezePeriod[]> {
    const now = new Date();

    const periodsToActivate = await this.gradeFreezeRepository.find({
      where: {
        status: FreezeStatus.SCHEDULED,
        startDate: LessThanOrEqual(now),
        endDate: MoreThanOrEqual(now),
      },
    });

    for (const period of periodsToActivate) {
      period.status = FreezeStatus.ACTIVE;
    }

    return await this.gradeFreezeRepository.save(periodsToActivate);
  }

  /**
   * Complete freeze periods that have ended
   */
  async completeExpiredPeriods(): Promise<GradeFreezePeriod[]> {
    const now = new Date();

    const periodsToComplete = await this.gradeFreezeRepository.find({
      where: {
        status: FreezeStatus.ACTIVE,
        endDate: LessThanOrEqual(now),
      },
    });

    for (const period of periodsToComplete) {
      period.status = FreezeStatus.COMPLETED;
    }

    return await this.gradeFreezeRepository.save(periodsToComplete);
  }

  /**
   * Update a freeze period
   */
  async updateFreezePeriod(
    id: string,
    updates: Partial<GradeFreezePeriod>,
  ): Promise<GradeFreezePeriod> {
    const freezePeriod = await this.getFreezePeriodById(id);

    if (freezePeriod.status === FreezeStatus.ACTIVE) {
      throw new BadRequestException('Cannot update active freeze periods');
    }
    if (freezePeriod.status === FreezeStatus.COMPLETED) {
      throw new BadRequestException('Cannot update completed freeze periods');
    }

    // Validate date changes
    if (updates.startDate || updates.endDate) {
      const startDate = updates.startDate || freezePeriod.startDate;
      const endDate = updates.endDate || freezePeriod.endDate;

      if (startDate >= endDate) {
        throw new BadRequestException('End date must be after start date');
      }

      // Check for overlapping periods
      const overlapping = await this.checkOverlappingPeriods(
        freezePeriod.schoolYearId,
        startDate,
        endDate,
        updates.scope || freezePeriod.scope,
        updates.termId || freezePeriod.termId,
        updates.classId || freezePeriod.classId,
        id,
      );

      if (overlapping.length > 0) {
        throw new BadRequestException(
          `Overlapping freeze period found: ${overlapping[0].title}`,
        );
      }
    }

    // Hash new override password if provided
    if (updates.overridePassword) {
      updates.overridePassword = await bcrypt.hash(
        updates.overridePassword,
        10,
      );
    }

    Object.assign(freezePeriod, updates);
    return await this.gradeFreezeRepository.save(freezePeriod);
  }

  /**
   * Delete a freeze period
   */
  async deleteFreezePeriod(id: string): Promise<void> {
    const freezePeriod = await this.getFreezePeriodById(id);

    if (freezePeriod.status === FreezeStatus.ACTIVE) {
      throw new BadRequestException('Cannot delete active freeze periods');
    }

    await this.gradeFreezeRepository.delete(id);
  }
}
