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
import { FeeType } from './fee-type.entity';
import { Payment, PaymentStatus } from './payment.entity';
import { SchoolYear } from './school-year.entity';
import { Discount } from './discount.entity';
import { InvoiceItem } from './invoice-item.entity';

export enum FeeStatus {
  PENDING = 'pending',
  PARTIAL = 'partial',
  PAID = 'paid',
  OVERDUE = 'overdue',
}

@Entity('student_fees')
export class StudentFee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  @Index()
  studentId: string;

  @Column({ type: 'uuid', nullable: false })
  @Index()
  feeTypeId: string;

  @Column({ type: 'uuid', nullable: false })
  @Index()
  academicYearId: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: false,
  })
  amountAssigned: number;

  @Column({ type: 'date', nullable: true })
  dueDate?: Date;

  @Column({
    type: 'enum',
    enum: FeeStatus,
    default: FeeStatus.PENDING,
  })
  status: FeeStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Student, (student) => student.studentFees, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => FeeType, (feeType) => feeType.studentFees, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'fee_type_id' })
  feeType: FeeType;

  @ManyToOne(() => SchoolYear, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'academic_year_id' })
  academicYear: SchoolYear;

  @OneToMany(() => Payment, (payment) => payment.studentFee)
  payments: Payment[];

  @OneToMany(() => Discount, (discount) => discount.studentFee)
  discounts: Discount[];

  @OneToMany(() => InvoiceItem, (invoiceItem) => invoiceItem.studentFee)
  invoiceItems: InvoiceItem[];

  // Méthode pour calculer le montant payé dynamiquement
  get amountPaid(): number {
    if (!this.payments) return 0;
    return this.payments
      .filter((payment) => payment.status === PaymentStatus.SUCCESSFUL)
      .reduce((sum, payment) => sum + Number(payment.amount), 0);
  }
}
