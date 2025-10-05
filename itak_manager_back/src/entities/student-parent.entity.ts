import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { Student } from './student.entity';
import { Parent } from './parent.entity';

export enum RelationshipType {
  FATHER = 'père',
  MOTHER = 'mère',
  GUARDIAN = 'tuteur',
  STEPFATHER = 'beau-père',
  STEPMOTHER = 'belle-mère',
  GRANDFATHER = 'grand-père',
  GRANDMOTHER = 'grand-mère',
  OTHER = 'autre',
}

@Entity('student_parents')
@Unique(['studentId', 'parentId'])
export class StudentParent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  studentId: string;

  @Column({ type: 'uuid' })
  @Index()
  parentId: string;

  @Column({
    type: 'enum',
    enum: RelationshipType,
    default: RelationshipType.FATHER,
  })
  @Index()
  relationship: RelationshipType;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Student, (student) => student.studentParents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => Parent, (parent) => parent.studentParents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_id' })
  parent: Parent;
}
