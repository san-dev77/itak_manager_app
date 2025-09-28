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
import { Student } from './student.entity';
import { InvoiceItem } from './invoice-item.entity';

export enum InvoiceStatus {
  UNPAID = 'unpaid',
  PARTIAL = 'partial',
  PAID = 'paid',
  CANCELLED = 'cancelled',
}

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  @Index()
  studentId: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  @Index()
  invoiceNumber: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: false })
  totalAmount: number;

  @Column({
    type: 'enum',
    enum: InvoiceStatus,
    default: InvoiceStatus.UNPAID,
  })
  status: InvoiceStatus;

  @Column({ type: 'date', nullable: false })
  issuedDate: Date;

  @Column({ type: 'date', nullable: true })
  dueDate?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Student, (student) => student.invoices, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @OneToMany(() => InvoiceItem, (invoiceItem) => invoiceItem.invoice)
  items: InvoiceItem[];
}
