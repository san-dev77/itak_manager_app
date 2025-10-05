import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
  Check,
  UpdateDateColumn,
} from 'typeorm';
import { Student } from './student.entity';
import { Class } from './class.entity';

export enum StudentClassStatus {
  ACTIVE = 'active',
  TRANSFERRED = 'transferred',
  REPEATING = 'repeating',
  GRADUATED = 'graduated',
  DROPPED = 'dropped',
}

@Entity('student_classes')
@Unique(['studentId', 'classId'])
@Check('chk_start_date_not_future', 'start_date <= CURRENT_DATE')
@Check('chk_end_date_after_start', 'end_date IS NULL OR end_date >= start_date')
export class StudentClass {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  studentId: string;

  @Column({ type: 'uuid' })
  @Index()
  classId: string;

  @Column({ type: 'date' })
  @Index()
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  @Index()
  endDate: Date;

  @Column({
    type: 'enum',
    enum: StudentClassStatus,
    default: StudentClassStatus.ACTIVE,
  })
  @Index()
  status: StudentClassStatus;

  @Column({ type: 'varchar', length: 9 })
  @Index()
  year: string; // ex: "2025-2026"

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Student, (student) => student.studentClasses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => Class, (classEntity) => classEntity.studentClasses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'class_id' })
  class: Class;
}
