import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssessmentService } from './assessment.service';
import { AssessmentController } from './assessment.controller';
import { Assessment } from '../../entities/assessment.entity';
import { Term } from '../../entities/term.entity';
import { ClassSubject } from '../../entities/class-subject.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Assessment, Term, ClassSubject])],
  controllers: [AssessmentController],
  providers: [AssessmentService],
  exports: [AssessmentService],
})
export class AssessmentModule {}
