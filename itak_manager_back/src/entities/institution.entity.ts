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
import { ClassCategory } from './class-category.entity';

@Entity('institutions')
export class Institution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  @Index()
  name: string;

  @Column({ type: 'varchar', length: 10, unique: true })
  @Index()
  code: string; // 'ITAK' ou 'UPCD'

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // Relations
  @OneToMany(() => Student, (student) => student.institution)
  students: Student[];

  @OneToMany(() => Teacher, (teacher) => teacher.institution)
  teachers: Teacher[];

  @OneToMany(() => ClassCategory, (category) => category.institution)
  classCategories: ClassCategory[];
}

