import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Student } from './student.entity';
import { Assessment } from './assessment.entity';
import { GradeComplaintHistory } from './grade-complaint-history.entity';
// Forward declaration to avoid circular dependency
// import { GradeComplaintHistory } from './grade-complaint-history.entity';

export enum ComplaintStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('grade_complaints')
export class GradeComplaint {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  studentId: string;

  @Column({ type: 'uuid' })
  @Index()
  assessmentId: string;

  @Column({
    type: 'enum',
    enum: ComplaintStatus,
    default: ComplaintStatus.PENDING,
  })
  @Index()
  status: ComplaintStatus;

  @Column({ type: 'text' })
  reason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Student, (student) => student.gradeComplaints, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => Assessment, (assessment) => assessment.gradeComplaints, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'assessment_id' })
  assessment: Assessment;

  @OneToMany(() => GradeComplaintHistory, (history) => history.complaint)
  history: GradeComplaintHistory[];
}
