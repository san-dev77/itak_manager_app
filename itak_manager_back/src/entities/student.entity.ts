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
import { User } from './user.entity';
import { StudentClass } from './student-class.entity';
import { StudentParent } from './student-parent.entity';
import { StudentPromotion } from './student-promotion.entity';
import { AssessmentResult } from './assessment-result.entity';
import { GradeComplaint } from './grade-complaint.entity';
import { StudentTransfer } from './student-transfer.entity';
import { AssessmentAttendance } from './assessment-attendance.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  @Index()
  userId: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  @Index()
  matricule: string;

  @Column({ type: 'date' })
  @Index()
  enrollmentDate: Date;

  @Column({ type: 'text', nullable: true })
  photo?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  maritalStatus?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  fatherName?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  motherName?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  tutorName?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  tutorPhone?: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  emergencyContact?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.students, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => StudentClass, (studentClass) => studentClass.student)
  studentClasses: StudentClass[];

  @OneToMany(() => StudentParent, (studentParent) => studentParent.student)
  studentParents: StudentParent[];

  @OneToMany(() => StudentPromotion, (promotion) => promotion.student)
  promotions: StudentPromotion[];

  @OneToMany(() => AssessmentResult, (result) => result.student)
  assessmentResults: AssessmentResult[];

  @OneToMany(() => GradeComplaint, (complaint) => complaint.student)
  gradeComplaints: GradeComplaint[];

  @OneToMany(() => StudentTransfer, (transfer) => transfer.student)
  transfers: StudentTransfer[];

  @OneToMany(() => AssessmentAttendance, (attendance) => attendance.student)
  assessmentAttendances: AssessmentAttendance[];
}
