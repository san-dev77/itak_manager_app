import { Module } from '@nestjs/common';
import { ConfigController } from '../controllers/config.controller';
import { ClassSubjectService } from '../services/class-subject.service';
import { StudentClassService } from '../services/student-class.service';
import { TeachingAssignmentService } from '../services/teaching-assignment.service';

@Module({
  controllers: [ConfigController],
  providers: [
    ClassSubjectService,
    StudentClassService,
    TeachingAssignmentService,
  ],
  exports: [
    ClassSubjectService,
    StudentClassService,
    TeachingAssignmentService,
  ],
})
export class ConfigModule {}
