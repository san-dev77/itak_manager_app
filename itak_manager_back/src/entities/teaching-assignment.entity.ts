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
import { Teacher } from './teacher.entity';
import { ClassSubject } from './class-subject.entity';

@Entity('teaching_assignments')
@Unique(['teacherId', 'classSubjectId'])
@Check('chk_start_date_not_future', 'start_date <= CURRENT_DATE')
@Check('chk_end_date_after_start', 'end_date IS NULL OR end_date >= start_date')
export class TeachingAssignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  teacherId: string;

  @Column({ type: 'uuid' })
  @Index()
  classSubjectId: string;

  @Column({ type: 'date' })
  @Index()
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  @Index()
  endDate?: Date;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Teacher, (teacher) => teacher.teachingAssignments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'teacher_id' })
  teacher: Teacher;

  @ManyToOne(
    () => ClassSubject,
    (classSubject) => classSubject.teachingAssignments,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'class_subject_id' })
  classSubject: ClassSubject;
}
