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
import { Class } from './class.entity';
import { User } from './user.entity';
import { SchoolYear } from './school-year.entity';

export enum EventType {
  EXAM = 'exam',
  HOMEWORK = 'homework',
  CULTURAL_DAY = 'cultural_day',
  HEALTH_DAY = 'health_day',
  BALL = 'ball',
  OTHER = 'other',
}

@Entity('events')
@Index(['startDate', 'eventType'])
@Index(['classId', 'startDate'])
@Index(['academicYearId', 'startDate'])
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: EventType,
    nullable: false,
  })
  @Index()
  eventType: EventType;

  @Column({ type: 'date', nullable: false })
  @Index()
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate?: Date;

  @Column({ type: 'boolean', default: true })
  allDay: boolean;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  classId?: string;

  @Column({ type: 'uuid', nullable: false })
  @Index()
  createdBy: string;

  @Column({ type: 'uuid', nullable: false })
  @Index()
  academicYearId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Class, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'class_id' })
  class?: Class;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @ManyToOne(() => SchoolYear, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'academic_year_id' })
  academicYear: SchoolYear;

  @OneToMany('EventParticipant', 'event')
  participants: any[];
}
