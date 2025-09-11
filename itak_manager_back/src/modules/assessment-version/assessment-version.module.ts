import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssessmentVersionService } from './assessment-version.service';
import { AssessmentVersionController } from './assessment-version.controller';
import { AssessmentVersion } from '../../entities/assessment-version.entity';
import { Assessment } from '../../entities/assessment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AssessmentVersion, Assessment])],
  controllers: [AssessmentVersionController],
  providers: [AssessmentVersionService],
  exports: [AssessmentVersionService],
})
export class AssessmentVersionModule {}
