import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventParticipantService } from './event-participant.service';
import { EventParticipantController } from './event-participant.controller';
import { EventParticipant } from '../../entities/event-participant.entity';
import { Event } from '../../entities/event.entity';
import { User } from '../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventParticipant, Event, User])],
  controllers: [EventParticipantController],
  providers: [EventParticipantService],
  exports: [EventParticipantService],
})
export class EventParticipantModule {}
