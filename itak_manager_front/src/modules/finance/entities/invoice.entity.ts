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
import { Student } from "../../users/entities/student.entity";
import { InvoiceItem } from "./invoice-item.entity";

export enum InvoiceStatus {
  UNPAID = "unpaid",
  PARTIAL = "partial",
  PAID = "paid",
  CANCELLED = "cancelled",
}

@Entity("invoices")
export class Invoice {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid")
  studentId: string;

  @Column({ unique: true })
  invoiceNumber: string;

  @Column("decimal", { precision: 12, scale: 2 })
  totalAmount: number;

  @Column({
    type: "enum",
    enum: InvoiceStatus,
    default: InvoiceStatus.UNPAID,
  })
  status: InvoiceStatus;

  @Column()
  issuedDate: Date;

  @Column()
  dueDate: Date;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Student, { onDelete: "CASCADE" })
  @JoinColumn({ name: "studentId" })
  student: Student;

  @OneToMany(() => InvoiceItem, (invoiceItem) => invoiceItem.invoice)
  invoiceItems: InvoiceItem[];

  // Méthode calculée pour le montant payé
  get amountPaid(): number {
    if (!this.invoiceItems) return 0;
    return this.invoiceItems.reduce((total, item) => {
      const studentFee = item.studentFee;
      if (studentFee) {
        return total + studentFee.amountPaid;
      }
      return total;
    }, 0);
  }

  // Méthode calculée pour le montant restant
  get amountRemaining(): number {
    return Number(this.totalAmount) - this.amountPaid;
  }
}
