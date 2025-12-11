import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { GradeComplaint } from './grade-complaint.entity';
import { User } from './user.entity';

@Entity('grade_complaint_history')
export class GradeComplaintHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  complaintId: string;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  oldScore: number;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  newScore: number;

  @Column({ type: 'uuid' })
  @Index()
  changedBy: string;

  @CreateDateColumn()
  changedAt: Date;

  @Column({ type: 'text', nullable: true })
  comment: string;

  // Relations
  @ManyToOne(() => GradeComplaint, (complaint) => complaint.history, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'complaint_id' })
  complaint: GradeComplaint;

  @ManyToOne(() => User, (user) => user.gradeComplaintHistory, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'changed_by' })
  changedByUser: User;
}
