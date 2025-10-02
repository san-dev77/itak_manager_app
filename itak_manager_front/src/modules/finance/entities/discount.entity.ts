import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { StudentFee } from "./student-fee.entity";
import { User } from "../../users/entities/user.entity";

export enum DiscountType {
  SCHOLARSHIP = "scholarship",
  SIBLING_DISCOUNT = "sibling_discount",
  EXEMPTION = "exemption",
  OTHER = "other",
}

@Entity("discounts")
export class Discount {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid")
  studentFeeId: string;

  @Column({
    type: "enum",
    enum: DiscountType,
  })
  type: DiscountType;

  @Column({ nullable: true })
  description: string;

  @Column("decimal", { precision: 12, scale: 2 })
  amount: number;

  @Column("uuid")
  approvedBy: string;

  @Column({ default: false })
  isApproved: boolean;

  @Column({ nullable: true })
  approvalDate: Date;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => StudentFee, (studentFee) => studentFee.discounts, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "studentFeeId" })
  studentFee: StudentFee;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "approvedBy" })
  approvedByUser: User;
}
