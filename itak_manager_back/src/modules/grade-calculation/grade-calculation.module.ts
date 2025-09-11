import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GradeCalculationService } from './grade-calculation.service';
import { GradeCalculationController } from './grade-calculation.controller';
import { AssessmentResult } from '../../entities/assessment-result.entity';
import { Assessment } from '../../entities/assessment.entity';
import { ClassSubject } from '../../entities/class-subject.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AssessmentResult, Assessment, ClassSubject]),
  ],
  controllers: [GradeCalculationController],
  providers: [GradeCalculationService],
  exports: [GradeCalculationService],
})
export class GradeCalculationModule {}
