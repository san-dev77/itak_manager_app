import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssessmentResultService } from './assessment-result.service';
import { AssessmentResultController } from './assessment-result.controller';
import { AssessmentResult } from '../../entities/assessment-result.entity';
import { Assessment } from '../../entities/assessment.entity';
import { Student } from '../../entities/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AssessmentResult, Assessment, Student])],
  controllers: [AssessmentResultController],
  providers: [AssessmentResultService],
  exports: [AssessmentResultService],
})
export class AssessmentResultModule {}
