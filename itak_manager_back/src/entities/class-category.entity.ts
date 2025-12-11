import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Class } from './class.entity';
import { Institution } from './institution.entity';

@Entity('class_category')
export class ClassCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  @Index()
  name: string;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  institutionId?: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => Institution, (institution) => institution.classCategories, {
    nullable: true,
  })
  @JoinColumn({ name: 'institution_id' })
  institution?: Institution;

  @OneToMany(() => Class, (class_) => class_.classCategory)
  classes: Class[];
}
