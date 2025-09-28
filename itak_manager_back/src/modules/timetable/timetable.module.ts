import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimetableService } from './timetable.service';
import { TimetableController } from './timetable.controller';
import { Timetable } from '../../entities/timetable.entity';
import { Class } from '../../entities/class.entity';
import { User } from '../../entities/user.entity';
import { Subject } from '../../entities/subject.entity';
import { SchoolYear } from '../../entities/school-year.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Timetable, Class, User, Subject, SchoolYear]),
  ],
  controllers: [TimetableController],
  providers: [TimetableService],
  exports: [TimetableService],
})
export class TimetableModule {}
