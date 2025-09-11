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

  @Column({ name: 'assessment_id', type: 'uuid' })
  @Index()
  assessmentId: string;

  @Column({ name: 'file_url', type: 'text' })
  fileUrl: string;

  @Column({
    name: 'file_type',
    type: 'enum',
    enum: FileType,
  })
  fileType: FileType;

  @Column({ name: 'uploaded_by', type: 'uuid' })
  @Index()
  uploadedBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
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
