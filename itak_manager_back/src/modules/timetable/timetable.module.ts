import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimetableService } from './timetable.service';
import { TimetableController } from './timetable.controller';
import { Timetable } from '../../entities/timetable.entity';
import { TeachingAssignment } from '../../entities/teaching-assignment.entity';
import { SchoolYear } from '../../entities/school-year.entity';
import { Class } from '../../entities/class.entity';
import { User } from '../../entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Timetable,
      TeachingAssignment,
      SchoolYear,
      Class,
      User,
    ]),
  ],
  controllers: [TimetableController],
  providers: [TimetableService],
  exports: [TimetableService],
})
export class TimetableModule {}
