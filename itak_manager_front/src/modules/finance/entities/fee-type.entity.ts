import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { StudentFee } from "./student-fee.entity";

export enum FeeFrequency {
  ONCE = "once",
  MONTHLY = "monthly",
  QUARTERLY = "quarterly",
  YEARLY = "yearly",
}

@Entity("fee_types")
export class FeeType {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column("decimal", { precision: 12, scale: 2, default: 0 })
  amountDefault: number;

  @Column({ default: false })
  isRecurring: boolean;

  @Column({
    type: "enum",
    enum: FeeFrequency,
    default: FeeFrequency.ONCE,
  })
  frequency: FeeFrequency;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => StudentFee, (studentFee) => studentFee.feeType)
  studentFees: StudentFee[];
}
