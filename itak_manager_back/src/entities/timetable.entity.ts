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
import { TeachingAssignment } from './teaching-assignment.entity';
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
@Index(['teachingAssignmentId', 'academicYearId', 'dayOfWeek', 'startTime'])
@Index(['academicYearId', 'dayOfWeek', 'startTime'])
export class Timetable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  @Index()
  teachingAssignmentId: string;

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
  @ManyToOne(() => TeachingAssignment, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'teaching_assignment_id' })
  teachingAssignment: TeachingAssignment;

  @ManyToOne(() => SchoolYear, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'academic_year_id' })
  academicYear: SchoolYear;
}
