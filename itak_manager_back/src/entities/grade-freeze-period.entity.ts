import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Check,
} from 'typeorm';
import { SchoolYear } from './school-year.entity';
import { Term } from './term.entity';
import { Class } from './class.entity';
import { User } from './user.entity';

export enum FreezeScope {
  SCHOOL_WIDE = 'school_wide',
  TERM_SPECIFIC = 'term_specific',
  CLASS_SPECIFIC = 'class_specific',
}

export enum FreezeStatus {
  SCHEDULED = 'scheduled',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('grade_freeze_periods')
@Index(['schoolYearId', 'startDate', 'endDate'])
@Index(['status', 'scope'])
@Check('chk_end_date_after_start', 'end_date > start_date')
export class GradeFreezePeriod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'school_year_id', type: 'uuid' })
  @Index()
  schoolYearId: string;

  @Column({ name: 'term_id', type: 'uuid', nullable: true })
  @Index()
  termId: string;

  @Column({ name: 'class_id', type: 'uuid', nullable: true })
  @Index()
  classId: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: FreezeScope,
    default: FreezeScope.SCHOOL_WIDE,
  })
  @Index()
  scope: FreezeScope;

  @Column({
    type: 'enum',
    enum: FreezeStatus,
    default: FreezeStatus.SCHEDULED,
  })
  @Index()
  status: FreezeStatus;

  @Column({ name: 'start_date', type: 'timestamp' })
  @Index()
  startDate: Date;

  @Column({ name: 'end_date', type: 'timestamp' })
  @Index()
  endDate: Date;

  @Column({ name: 'created_by', type: 'uuid' })
  createdBy: string;

  @Column({ name: 'approved_by', type: 'uuid', nullable: true })
  approvedBy: string;

  @Column({ name: 'approved_at', type: 'timestamp', nullable: true })
  approvedAt: Date;

  @Column({ name: 'cancelled_by', type: 'uuid', nullable: true })
  cancelledBy: string;

  @Column({ name: 'cancelled_at', type: 'timestamp', nullable: true })
  cancelledAt: Date;

  @Column({ name: 'cancellation_reason', type: 'text', nullable: true })
  cancellationReason: string;

  @Column({ name: 'allow_emergency_override', type: 'boolean', default: false })
  allowEmergencyOverride: boolean;

  @Column({
    name: 'override_password',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  overridePassword: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => SchoolYear, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'school_year_id' })
  schoolYear: SchoolYear;

  @ManyToOne(() => Term, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'term_id' })
  term: Term;

  @ManyToOne(() => Class, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'approved_by' })
  approver: User;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'cancelled_by' })
  canceller: User;
}
