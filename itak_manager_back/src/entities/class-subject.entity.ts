import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  Unique,
  Check,
  UpdateDateColumn,
} from 'typeorm';
import { Class } from './class.entity';
import { Subject } from './subject.entity';
import { TeachingAssignment } from './teaching-assignment.entity';
import { Assessment } from './assessment.entity';

@Entity('class_subjects')
@Unique(['classId', 'subjectId'])
@Check('chk_coefficient_positive', 'coefficient >= 0')
@Check('chk_weekly_hours_positive', 'weekly_hours IS NULL OR weekly_hours >= 0')
export class ClassSubject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  classId: string;

  @Column({ type: 'uuid' })
  @Index()
  subjectId: string;

  @Column({ type: 'integer', default: 1 })
  @Index()
  coefficient: number;

  @Column({ type: 'integer', nullable: true })
  weeklyHours: number;

  @Column({ type: 'boolean', default: false })
  isOptional: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Class, (classEntity) => classEntity.classSubjects, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @ManyToOne(() => Subject, (subject) => subject.classSubjects, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @OneToMany(() => TeachingAssignment, (assignment) => assignment.classSubject)
  teachingAssignments: TeachingAssignment[];

  @OneToMany(() => Assessment, (assessment) => assessment.classSubject)
  assessments: Assessment[];
}
