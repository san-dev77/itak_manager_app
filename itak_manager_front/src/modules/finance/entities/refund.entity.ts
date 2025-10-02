import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Payment } from "./payment.entity";
import { User } from "../../users/entities/user.entity";

@Entity("refunds")
export class Refund {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid")
  paymentId: string;

  @Column("decimal", { precision: 12, scale: 2 })
  amount: number;

  @Column()
  reason: string;

  @Column("uuid")
  processedBy: string;

  @Column({ default: false })
  isProcessed: boolean;

  @Column({ nullable: true })
  processedDate: Date;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Payment, (payment) => payment.refunds, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "paymentId" })
  payment: Payment;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "processedBy" })
  processedByUser: User;
}
