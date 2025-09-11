import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToMany,
  Index,
  UpdateDateColumn,
} from 'typeorm';
import { ClassSubject } from './class-subject.entity';
import { Teacher } from './teacher.entity';

@Entity('subjects')
export class Subject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  @Index()
  name: string;

  @Column({ type: 'varchar', length: 10, unique: true })
  @Index()
  code: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => ClassSubject, (classSubject) => classSubject.subject)
  classSubjects: ClassSubject[];

  @ManyToMany(() => Teacher, (teacher) => teacher.subjects)
  teachers: Teacher[];
}
