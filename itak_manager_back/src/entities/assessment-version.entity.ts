import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Assessment } from './assessment.entity';
import { User } from './user.entity';
import { AssessmentType } from './assessment.entity';

export enum VersionAction {
  CREATED = 'created',
  UPDATED = 'updated',
  DELETED = 'deleted',
  RESTORED = 'restored',
}

@Entity('assessment_versions')
@Index(['assessmentId', 'versionNumber'], { unique: true })
@Index(['assessmentId', 'createdAt'])
export class AssessmentVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'assessment_id', type: 'uuid' })
  @Index()
  assessmentId: string;

  @Column({ name: 'version_number', type: 'integer' })
  versionNumber: number;

  @Column({
    name: 'version_action',
    type: 'enum',
    enum: VersionAction,
  })
  versionAction: VersionAction;

  // Snapshot of assessment data at this version
  @Column({ type: 'uuid' })
  termId: string;

  @Column({ type: 'uuid' })
  classSubjectId: string;

  @Column({ name: 'school_year_id', type: 'uuid' })
  schoolYearId: string;

  @Column({
    type: 'enum',
    enum: AssessmentType,
    enumName: 'assessment_type_enum',
  })
  type: AssessmentType;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  maxScore: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  weight: number;

  // Version metadata
  @Column({ name: 'changed_by', type: 'uuid' })
  changedBy: string;

  @Column({ type: 'text', nullable: true })
  changeReason: string;

  @Column({ type: 'json', nullable: true })
  changedFields: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => Assessment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'assessment_id' })
  assessment: Assessment;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'changed_by' })
  user: User;
}
