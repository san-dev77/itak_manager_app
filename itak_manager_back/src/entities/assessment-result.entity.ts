import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Assessment } from './assessment.entity';
import { Student } from './student.entity';

export enum AssessmentResultStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  EXCUSED = 'excused',
  EXCLUDED = 'excluded',
}

@Entity('assessment_results')
@Index(['assessmentId', 'studentId'], { unique: true })
export class AssessmentResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'assessment_id', type: 'uuid' })
  assessmentId: string;

  @Column({ name: 'student_id', type: 'uuid' })
  studentId: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  score: number;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({
    type: 'enum',
    enum: AssessmentResultStatus,
    default: AssessmentResultStatus.PRESENT,
  })
  status: AssessmentResultStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Assessment, (assessment) => assessment.results, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'assessment_id' })
  assessment: Assessment;

  @ManyToOne(() => Student, (student) => student.assessmentResults, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  student: Student;
}
