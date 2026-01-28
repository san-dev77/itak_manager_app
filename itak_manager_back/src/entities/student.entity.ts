import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AssessmentAttendance } from './assessment-attendance.entity';
import { AssessmentResult } from './assessment-result.entity';
import { GradeComplaint } from './grade-complaint.entity';
import { Institution } from './institution.entity';
import { Invoice } from './invoice.entity';
import { StudentClass } from './student-class.entity';
import { StudentFee } from './student-fee.entity';
import { StudentParent } from './student-parent.entity';
import { StudentPromotion } from './student-promotion.entity';
import { StudentTransfer } from './student-transfer.entity';
import { User } from './user.entity';

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

  @Column({
    type: 'varchar',
    length: 20,
    default: 'non_boursier',
  })
  scholarshipStatus: string;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  institutionId?: string;

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

  @ManyToOne(() => Institution, (institution) => institution.students, {
    nullable: true,
  })
  @JoinColumn({ name: 'institution_id' })
  institution?: Institution;

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

  @OneToMany(() => StudentFee, (studentFee) => studentFee.student)
  studentFees: StudentFee[];

  @OneToMany(() => Invoice, (invoice) => invoice.student)
  invoices: Invoice[];
}
