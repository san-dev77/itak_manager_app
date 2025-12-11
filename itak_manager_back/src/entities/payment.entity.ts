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
import { StudentFee } from './student-fee.entity';
import { User } from './user.entity';
import { Refund } from './refund.entity';

export enum PaymentMethod {
  CASH = 'cash',
  BANK_TRANSFER = 'bank_transfer',
  MOBILE_MONEY = 'mobile_money',
  CARD = 'card',
}

export enum PaymentStatus {
  SUCCESSFUL = 'successful',
  FAILED = 'failed',
  PENDING = 'pending',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  @Index()
  studentFeeId: string;

  @Column({ type: 'timestamp', nullable: false })
  paymentDate: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: false })
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    nullable: false,
  })
  method: PaymentMethod;

  @Column({ type: 'varchar', length: 50, nullable: true })
  provider?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  transactionRef?: string;

  @Column({ type: 'uuid', nullable: false })
  @Index()
  receivedBy: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.SUCCESSFUL,
  })
  status: PaymentStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => StudentFee, (studentFee) => studentFee.payments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'student_fee_id' })
  studentFee: StudentFee;

  @ManyToOne(() => User, (user) => user.receivedPayments, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'received_by' })
  receivedByUser: User;

  @OneToMany(() => Refund, (refund) => refund.payment)
  refunds: Refund[];
}
