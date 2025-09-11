import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  PrimaryColumn,
} from 'typeorm';
import { Assessment } from './assessment.entity';
import { Student } from './student.entity';

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  EXCUSED = 'excused',
  EXCLUDED = 'excluded',
}

@Entity('assessment_attendance')
export class AssessmentAttendance {
  @PrimaryColumn({ name: 'assessment_id', type: 'uuid' })
  @Index()
  assessmentId: string;

  @PrimaryColumn({ name: 'student_id', type: 'uuid' })
  @Index()
  studentId: string;

  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.PRESENT,
  })
  @Index()
  status: AttendanceStatus;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({ name: 'marked_by', type: 'uuid', nullable: true })
  markedBy: string;

  @Column({ name: 'marked_at', type: 'timestamp', nullable: true })
  markedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Assessment, (assessment) => assessment.attendances, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'assessment_id' })
  assessment: Assessment;

  @ManyToOne(() => Student, (student) => student.assessmentAttendances, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  student: Student;
}
