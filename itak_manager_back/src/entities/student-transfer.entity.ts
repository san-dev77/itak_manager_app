import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Check,
} from 'typeorm';
import { Student } from './student.entity';
import { Class } from './class.entity';

export enum TransferReason {
  DISCIPLINARY = 'disciplinary',
  ACADEMIC = 'academic',
  MEDICAL = 'medical',
  FAMILY_REQUEST = 'family_request',
  ADMINISTRATIVE = 'administrative',
  CAPACITY_ADJUSTMENT = 'capacity_adjustment',
}

@Entity('student_transfers')
@Check('chk_different_classes', 'from_class_id != to_class_id')
@Check('chk_transfer_date_not_future', 'transfer_date <= CURRENT_DATE')
export class StudentTransfer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'student_id', type: 'uuid' })
  @Index()
  studentId: string;

  @Column({ name: 'from_class_id', type: 'uuid' })
  @Index()
  fromClassId: string;

  @Column({ name: 'to_class_id', type: 'uuid' })
  @Index()
  toClassId: string;

  @Column({ name: 'transfer_date', type: 'date' })
  @Index()
  transferDate: Date;

  @Column({
    type: 'enum',
    enum: TransferReason,
  })
  @Index()
  reason: TransferReason;

  @Column({ type: 'text', nullable: true })
  reasonDetails: string;

  @Column({ type: 'varchar', length: 9 })
  @Index()
  year: string; // ex: "2025-2026"

  @Column({ name: 'approved_by', type: 'uuid', nullable: true })
  approvedBy: string;

  @Column({ name: 'approval_date', type: 'timestamp', nullable: true })
  approvalDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Student, (student) => student.transfers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => Class, (classEntity) => classEntity.transfersFrom, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'from_class_id' })
  fromClass: Class;

  @ManyToOne(() => Class, (classEntity) => classEntity.transfersTo, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'to_class_id' })
  toClass: Class;
}
