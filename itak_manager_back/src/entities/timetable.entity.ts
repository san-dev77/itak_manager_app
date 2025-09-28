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
import { Class } from './class.entity';
import { User } from './user.entity';
import { Subject } from './subject.entity';
import { SchoolYear } from './school-year.entity';

export enum DayOfWeek {
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
}

@Entity('timetables')
@Index(['classId', 'teacherId', 'academicYearId', 'dayOfWeek', 'startTime'])
@Index(['teacherId', 'academicYearId', 'dayOfWeek', 'startTime'])
export class Timetable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  @Index()
  classId: string;

  @Column({ type: 'uuid', nullable: false })
  @Index()
  teacherId: string;

  @Column({ type: 'uuid', nullable: false })
  @Index()
  subjectId: string;

  @Column({ type: 'uuid', nullable: false })
  @Index()
  academicYearId: string;

  @Column({
    type: 'enum',
    enum: DayOfWeek,
    nullable: false,
  })
  @Index()
  dayOfWeek: DayOfWeek;

  @Column({ type: 'time', nullable: false })
  startTime: string;

  @Column({ type: 'time', nullable: false })
  endTime: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  room?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Class, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'teacher_id' })
  teacher: User;

  @ManyToOne(() => Subject, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @ManyToOne(() => SchoolYear, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'academic_year_id' })
  academicYear: SchoolYear;
}
