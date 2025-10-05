import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { SchoolYear } from './school-year.entity';
import { Assessment } from './assessment.entity';

@Entity('terms')
export class Term {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  schoolYearId: string;

  @Column({ type: 'varchar', length: 20 })
  @Index()
  name: string;

  @Column({ type: 'date' })
  @Index()
  startDate: Date;

  @Column({ type: 'date' })
  @Index()
  endDate: Date;

  @Column({ type: 'boolean', default: false })
  @Index()
  isActive: boolean;

  @Column({ type: 'int', default: 1 })
  @Index()
  orderNumber: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => SchoolYear, (schoolYear) => schoolYear.terms, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'schoolYearId' })
  schoolYear: SchoolYear;

  @OneToMany(() => Assessment, (assessment) => assessment.term)
  assessments: Assessment[];
}
