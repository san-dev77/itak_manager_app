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
import { StudentFee } from './student-fee.entity';
import { User } from './user.entity';

export enum DiscountType {
  SCHOLARSHIP = 'scholarship',
  SIBLING_DISCOUNT = 'sibling_discount',
  EXEMPTION = 'exemption',
  OTHER = 'other',
}

@Entity('discounts')
export class Discount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  @Index()
  studentFeeId: string;

  @Column({
    type: 'enum',
    enum: DiscountType,
    nullable: false,
  })
  type: DiscountType;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: false })
  amount: number;

  @Column({ type: 'uuid', nullable: false })
  @Index()
  approvedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => StudentFee, (studentFee) => studentFee.discounts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'student_fee_id' })
  studentFee: StudentFee;

  @ManyToOne(() => User, (user) => user.approvedDiscounts, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'approved_by' })
  approvedByUser: User;
}
