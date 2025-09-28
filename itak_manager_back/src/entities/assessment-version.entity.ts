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

export enum AssessmentVersionType {
  EXAM = 'exam', // Examens finaux
  HOMEWORK = 'homework', // Devoirs à la maison
  SUPERVISED_HOMEWORK = 'supervised_homework', // Devoirs surveillés (DS)
  TEST = 'test', // Tests courts
  QUIZ = 'quiz', // Quiz rapides
  MONTHLY_COMPOSITION = 'monthly_composition', // Compositions mensuelles
  CONTINUOUS_ASSESSMENT = 'continuous_assessment', // Contrôle continu
}

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

  @Column({ type: 'uuid' })
  @Index()
  assessmentId: string;

  @Column({ type: 'integer' })
  versionNumber: number;

  @Column({
    type: 'enum',
    enum: VersionAction,
  })
  versionAction: VersionAction;

  // Snapshot of assessment data at this version
  @Column({ type: 'uuid' })
  termId: string;

  @Column({ type: 'uuid' })
  classSubjectId: string;

  @Column({ type: 'uuid' })
  schoolYearId: string;

  @Column({
    type: 'enum',
    enum: AssessmentVersionType,
  })
  type: AssessmentVersionType;

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
  @Column({ type: 'uuid' })
  changedBy: string;

  @Column({ type: 'text', nullable: true })
  changeReason: string;

  @Column({ type: 'json', nullable: true })
  changedFields: string[];

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => Assessment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'assessment_id' })
  assessment: Assessment;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'changed_by' })
  user: User;
}
