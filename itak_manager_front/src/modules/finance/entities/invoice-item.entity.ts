import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Invoice } from "./invoice.entity";
import { StudentFee } from "./student-fee.entity";

@Entity("invoice_items")
export class InvoiceItem {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid")
  invoiceId: string;

  @Column("uuid")
  studentFeeId: string;

  @Column("decimal", { precision: 12, scale: 2 })
  amount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Invoice, (invoice) => invoice.invoiceItems, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "invoiceId" })
  invoice: Invoice;

  @ManyToOne(() => StudentFee, (studentFee) => studentFee.invoiceItems, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "studentFeeId" })
  studentFee: StudentFee;
}
