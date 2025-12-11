import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Institution } from './institution.entity';
import { TeachingAssignment } from './teaching-assignment.entity';
import { Subject } from './subject.entity';

@Entity('teachers')
export class Teacher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  @Index()
  userId: string;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
  @Index()
  matricule?: string;

  @Column({ type: 'date' })
  @Index()
  hireDate: Date;

  @Column({ type: 'text', nullable: true })
  photo?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  maritalStatus?: string;

  // Removed specialty field - now using Many-to-Many relation with Subject

  @Column({ type: 'text', nullable: true })
  diplomas?: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  emergencyContact?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  institutionId?: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.teachers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Institution, (institution) => institution.teachers, {
    nullable: true,
  })
  @JoinColumn({ name: 'institution_id' })
  institution?: Institution;

  @OneToMany(() => TeachingAssignment, (assignment) => assignment.teacher)
  teachingAssignments: TeachingAssignment[];

  @ManyToMany(() => Subject, (subject) => subject.teachers)
  @JoinTable({
    name: 'teacher_subjects',
    joinColumn: {
      name: 'teacher_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'subject_id',
      referencedColumnName: 'id',
    },
  })
  subjects: Subject[];
}
