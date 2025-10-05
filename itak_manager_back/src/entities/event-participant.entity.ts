import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';

export enum ParticipantRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  STAFF = 'staff',
  OTHER = 'other',
}

export enum ParticipantStatus {
  INVITED = 'invited',
  CONFIRMED = 'confirmed',
  DECLINED = 'declined',
  ABSENT = 'absent',
}

@Entity('event_participants')
@Index(['eventId', 'userId'], { unique: true })
@Index(['eventId', 'role'])
@Index(['eventId', 'status'])
export class EventParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  @Index()
  eventId: string;

  @Column({ type: 'uuid', nullable: false })
  @Index()
  userId: string;

  @Column({
    type: 'enum',
    enum: ParticipantRole,
    nullable: false,
  })
  @Index()
  role: ParticipantRole;

  @Column({
    type: 'enum',
    enum: ParticipantStatus,
    default: ParticipantStatus.INVITED,
  })
  @Index()
  status: ParticipantStatus;

  // Relations
  @ManyToOne('Event', 'participants', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'event_id' })
  event: any;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
