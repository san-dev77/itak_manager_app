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
import { Student } from './student.entity';
import { Class } from './class.entity';

@Entity('student_promotions')
export class StudentPromotion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  studentId: string;

  @Column({ type: 'uuid' })
  @Index()
  fromClassId: string;

  @Column({ type: 'uuid' })
  @Index()
  toClassId: string;

  @Column({ type: 'varchar', length: 9 })
  @Index()
  year: string;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Student, (student) => student.promotions)
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @ManyToOne(() => Class)
  @JoinColumn({ name: 'fromClassId' })
  fromClass: Class;

  @ManyToOne(() => Class)
  @JoinColumn({ name: 'toClassId' })
  toClass: Class;
}
