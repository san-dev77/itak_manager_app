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
import { Term } from './term.entity';
import { ClassSubject } from './class-subject.entity';
import { AssessmentResult } from './assessment-result.entity';
import { GradeComplaint } from './grade-complaint.entity';
import { AssessmentSubject } from './assessment-subject.entity';
import { SchoolYear } from './school-year.entity';
import { AssessmentAttendance } from './assessment-attendance.entity';
import { AssessmentVersion } from './assessment-version.entity';

export enum AssessmentType {
  EXAM = 'exam', // Examens finaux
  HOMEWORK = 'homework', // Devoirs à la maison
  SUPERVISED_HOMEWORK = 'supervised_homework', // Devoirs surveillés (DS)
  TEST = 'test', // Tests courts
  QUIZ = 'quiz', // Quiz rapides
  MONTHLY_COMPOSITION = 'monthly_composition', // Compositions mensuelles
  CONTINUOUS_ASSESSMENT = 'continuous_assessment', // Contrôle continu
}

@Entity('assessments')
export class Assessment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  termId: string;

  @Column({ type: 'uuid' })
  @Index()
  classSubjectId: string;

  @Column({ name: 'school_year_id', type: 'uuid' })
  @Index()
  schoolYearId: string;

  @Column({
    type: 'enum',
    enum: AssessmentType,
    default: AssessmentType.TEST,
  })
  @Index()
  type: AssessmentType;

  @Column({ type: 'varchar', length: 100 })
  @Index()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date' })
  @Index()
  startDate: Date;

  @Column({ type: 'date' })
  @Index()
  endDate: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  maxScore: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 1.0 })
  weight: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Term, (term) => term.assessments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'termId' })
  term: Term;

  @ManyToOne(() => ClassSubject, (classSubject) => classSubject.assessments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'classSubjectId' })
  classSubject: ClassSubject;

  @ManyToOne(() => SchoolYear, (schoolYear) => schoolYear.assessments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'school_year_id' })
  schoolYear: SchoolYear;

  @OneToMany(() => AssessmentResult, (result) => result.assessment)
  results: AssessmentResult[];

  @OneToMany(() => GradeComplaint, (complaint) => complaint.assessment)
  gradeComplaints: GradeComplaint[];

  @OneToMany(() => AssessmentSubject, (subject) => subject.assessment)
  subjects: AssessmentSubject[];

  @OneToMany(() => AssessmentAttendance, (attendance) => attendance.assessment)
  attendances: AssessmentAttendance[];

  @OneToMany(() => AssessmentVersion, (version) => version.assessment)
  versions: AssessmentVersion[];
}
