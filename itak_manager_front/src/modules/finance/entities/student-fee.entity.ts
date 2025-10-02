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
import { FeeType } from "./fee-type.entity";
import { SchoolYear } from "../../academic/entities/school-year.entity";
import { Payment } from "./payment.entity";
import { Discount } from "./discount.entity";
import { InvoiceItem } from "./invoice-item.entity";

export enum StudentFeeStatus {
  PENDING = "pending",
  PARTIAL = "partial",
  PAID = "paid",
  OVERDUE = "overdue",
}

@Entity("student_fees")
export class StudentFee {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid")
  studentId: string;

  @Column("uuid")
  feeTypeId: string;

  @Column("uuid")
  academicYearId: string;

  @Column("decimal", { precision: 12, scale: 2 })
  amountAssigned: number;

  @Column()
  dueDate: Date;

  @Column({
    type: "enum",
    enum: StudentFeeStatus,
    default: StudentFeeStatus.PENDING,
  })
  status: StudentFeeStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Student, { onDelete: "CASCADE" })
  @JoinColumn({ name: "studentId" })
  student: Student;

  @ManyToOne(() => FeeType, { onDelete: "CASCADE" })
  @JoinColumn({ name: "feeTypeId" })
  feeType: FeeType;

  @ManyToOne(() => SchoolYear, { onDelete: "CASCADE" })
  @JoinColumn({ name: "academicYearId" })
  academicYear: SchoolYear;

  @OneToMany(() => Payment, (payment) => payment.studentFee)
  payments: Payment[];

  @OneToMany(() => Discount, (discount) => discount.studentFee)
  discounts: Discount[];

  @OneToMany(() => InvoiceItem, (invoiceItem) => invoiceItem.studentFee)
  invoiceItems: InvoiceItem[];

  // Méthode calculée pour le montant payé
  get amountPaid(): number {
    if (!this.payments) return 0;
    return this.payments
      .filter((payment) => payment.status === "successful")
      .reduce((total, payment) => total + Number(payment.amount), 0);
  }

  // Méthode calculée pour le montant des réductions
  get totalDiscounts(): number {
    if (!this.discounts) return 0;
    return this.discounts.reduce(
      (total, discount) => total + Number(discount.amount),
      0
    );
  }

  // Méthode calculée pour le montant restant
  get amountRemaining(): number {
    return Number(this.amountAssigned) - this.amountPaid - this.totalDiscounts;
  }
}
