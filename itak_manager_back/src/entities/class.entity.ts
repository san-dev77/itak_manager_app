import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  Index,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ClassSubject } from './class-subject.entity';
import { StudentClass } from './student-class.entity';
import { ClassCategory } from './class-category.entity';
import { StudentTransfer } from './student-transfer.entity';

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  @Index()
  name: string;

  @Column({ type: 'varchar', length: 10, unique: true })
  @Index()
  code: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  level: string;

  @Column({ type: 'uuid' })
  @Index()
  categoryId: string;

  @Column({ type: 'int', nullable: true })
  capacity: number;

  @Column({ type: 'int' })
  @Index()
  orderLevel: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => ClassCategory, (classCategory) => classCategory.classes)
  classCategory: ClassCategory;

  @OneToMany(() => ClassSubject, (classSubject) => classSubject.class)
  classSubjects: ClassSubject[];

  @OneToMany(() => StudentClass, (studentClass) => studentClass.class)
  studentClasses: StudentClass[];

  @OneToMany(() => StudentTransfer, (transfer) => transfer.fromClass)
  transfersFrom: StudentTransfer[];

  @OneToMany(() => StudentTransfer, (transfer) => transfer.toClass)
  transfersTo: StudentTransfer[];
}
