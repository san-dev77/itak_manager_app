import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Invoice } from './invoice.entity';
import { StudentFee } from './student-fee.entity';

@Entity('invoice_items')
export class InvoiceItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  @Index()
  invoiceId: string;

  @Column({ type: 'uuid', nullable: false })
  @Index()
  studentFeeId: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  description: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: false })
  amount: number;

  // Relations
  @ManyToOne(() => Invoice, (invoice) => invoice.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice;

  @ManyToOne(() => StudentFee, (studentFee) => studentFee.invoiceItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'student_fee_id' })
  studentFee: StudentFee;
}
