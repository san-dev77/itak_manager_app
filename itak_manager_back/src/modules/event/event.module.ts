import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { Event } from '../../entities/event.entity';
import { Class } from '../../entities/class.entity';
import { User } from '../../entities/user.entity';
import { SchoolYear } from '../../entities/school-year.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Class, User, SchoolYear])],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
