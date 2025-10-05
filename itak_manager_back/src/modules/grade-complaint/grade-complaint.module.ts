import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GradeComplaintService } from './grade-complaint.service';
import { GradeComplaintController } from './grade-complaint.controller';
import { GradeComplaint } from '../../entities/grade-complaint.entity';
import { GradeComplaintHistory } from '../../entities/grade-complaint-history.entity';
import { Assessment } from '../../entities/assessment.entity';
import { Student } from '../../entities/student.entity';
import { AssessmentResult } from '../../entities/assessment-result.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GradeComplaint,
      GradeComplaintHistory,
      Assessment,
      Student,
      AssessmentResult,
    ]),
  ],
  controllers: [GradeComplaintController],
  providers: [GradeComplaintService],
  exports: [GradeComplaintService],
})
export class GradeComplaintModule {}
