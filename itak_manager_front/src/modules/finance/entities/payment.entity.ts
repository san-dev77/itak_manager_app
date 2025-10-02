import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { StudentFee } from "./student-fee.entity";
import { User } from "../../users/entities/user.entity";
import { Refund } from "./refund.entity";

export enum PaymentMethod {
  CASH = "cash",
  BANK_TRANSFER = "bank_transfer",
  MOBILE_MONEY = "mobile_money",
  CARD = "card",
}

export enum PaymentStatus {
  SUCCESSFUL = "successful",
  FAILED = "failed",
  PENDING = "pending",
}

@Entity("payments")
export class Payment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid")
  studentFeeId: string;

  @Column()
  paymentDate: Date;

  @Column("decimal", { precision: 12, scale: 2 })
  amount: number;

  @Column({
    type: "enum",
    enum: PaymentMethod,
  })
  method: PaymentMethod;

  @Column({ nullable: true })
  provider: string;

  @Column({ nullable: true })
  transactionRef: string;

  @Column("uuid")
  receivedBy: string;

  @Column({
    type: "enum",
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => StudentFee, (studentFee) => studentFee.payments, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "studentFeeId" })
  studentFee: StudentFee;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "receivedBy" })
  receivedByUser: User;

  @OneToMany(() => Refund, (refund) => refund.payment)
  refunds: Refund[];

  // Méthode calculée pour le montant remboursé
  get amountRefunded(): number {
    if (!this.refunds) return 0;
    return this.refunds.reduce(
      (total, refund) => total + Number(refund.amount),
      0
    );
  }

  // Méthode calculée pour le montant net (paiement - remboursements)
  get netAmount(): number {
    return Number(this.amount) - this.amountRefunded;
  }
}
