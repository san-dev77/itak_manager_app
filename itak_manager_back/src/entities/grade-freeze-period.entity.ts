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

  @Column({ type: 'uuid' })
  @Index()
  schoolYearId: string;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  termId: string;

  @Column({ type: 'uuid', nullable: true })
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

  @Column({ type: 'timestamp' })
  @Index()
  startDate: Date;

  @Column({ type: 'timestamp' })
  @Index()
  endDate: Date;

  @Column({ type: 'uuid' })
  createdBy: string;

  @Column({ type: 'uuid', nullable: true })
  approvedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  cancelledBy: string;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt: Date;

  @Column({ type: 'text', nullable: true })
  cancellationReason: string;

  @Column({ type: 'boolean', default: false })
  allowEmergencyOverride: boolean;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  overridePassword: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
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
