import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Student } from './student.entity';
import { Teacher } from './teacher.entity';
import { Staff } from './staff.entity';
import { Parent } from './parent.entity';
import { GradeComplaintHistory } from './grade-complaint-history.entity';
import { AssessmentSubject } from './assessment-subject.entity';

export enum UserRole {
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
  STAFF = 'staff',
  PARENT = 'parent',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  @Index()
  username: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  @Index()
  email: string;

  @Column({ type: 'varchar', length: 50 })
  firstName: string;

  @Column({ type: 'varchar', length: 50 })
  lastName: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  gender?: string;

  @Column({ type: 'date', nullable: true })
  birthDate?: Date;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  @Index()
  role: UserRole;

  @Column({ type: 'boolean', default: true })
  @Index()
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // Relations
  @OneToMany(() => Student, (student) => student.user)
  students: Student[];

  @OneToMany(() => Teacher, (teacher) => teacher.user)
  teachers: Teacher[];

  @OneToMany(() => Staff, (staff) => staff.user)
  staff: Staff[];

  @OneToMany(() => Parent, (parent) => parent.user)
  parents: Parent[];

  @OneToMany(() => GradeComplaintHistory, (history) => history.changedByUser)
  gradeComplaintHistory: GradeComplaintHistory[];

  @OneToMany(() => AssessmentSubject, (subject) => subject.uploadedByUser)
  assessmentSubjects: AssessmentSubject[];
}
