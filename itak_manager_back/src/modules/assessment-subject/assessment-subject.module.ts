import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssessmentSubjectService } from './assessment-subject.service';
import { AssessmentSubjectController } from './assessment-subject.controller';
import { AssessmentSubject } from '../../entities/assessment-subject.entity';
import { Assessment } from '../../entities/assessment.entity';
import { User } from '../../entities/user.entity';
import { FileUploadService } from '../../services/file-upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([AssessmentSubject, Assessment, User])],
  controllers: [AssessmentSubjectController],
  providers: [AssessmentSubjectService, FileUploadService],
  exports: [AssessmentSubjectService, FileUploadService],
})
export class AssessmentSubjectModule {}
