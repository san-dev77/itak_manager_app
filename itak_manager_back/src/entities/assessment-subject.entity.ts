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
import { Assessment } from './assessment.entity';
import { User } from './user.entity';

export enum FileType {
  PDF = 'pdf',
  DOC = 'doc',
  DOCX = 'docx',
  ODT = 'odt',
}

@Entity('assessment_subjects')
export class AssessmentSubject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  assessmentId: string;

  @Column({ type: 'text' })
  fileUrl: string;

  @Column({
    type: 'enum',
    enum: FileType,
  })
  fileType: FileType;

  @Column({ type: 'uuid' })
  @Index()
  uploadedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Assessment, (assessment) => assessment.subjects, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'assessment_id' })
  assessment: Assessment;

  @ManyToOne(() => User, (user) => user.assessmentSubjects, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'uploaded_by' })
  uploadedByUser: User;
}
