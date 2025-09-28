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
  @PrimaryColumn({ type: 'uuid' })
  @Index()
  assessmentId: string;

  @PrimaryColumn({ type: 'uuid' })
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

  @Column({ type: 'uuid', nullable: true })
  markedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  markedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
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
