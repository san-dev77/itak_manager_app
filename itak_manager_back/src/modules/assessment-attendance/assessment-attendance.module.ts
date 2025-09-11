import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssessmentAttendanceService } from './assessment-attendance.service';
import { AssessmentAttendanceController } from './assessment-attendance.controller';
import { AssessmentAttendance } from '../../entities/assessment-attendance.entity';
import { Assessment } from '../../entities/assessment.entity';
import { Student } from '../../entities/student.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AssessmentAttendance, Assessment, Student]),
  ],
  controllers: [AssessmentAttendanceController],
  providers: [AssessmentAttendanceService],
  exports: [AssessmentAttendanceService],
})
export class AssessmentAttendanceModule {}
