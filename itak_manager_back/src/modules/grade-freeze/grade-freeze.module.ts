import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GradeFreezeService } from './grade-freeze.service';
import { GradeFreezeController } from './grade-freeze.controller';
import { GradeFreezePeriod } from '../../entities/grade-freeze-period.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GradeFreezePeriod])],
  controllers: [GradeFreezeController],
  providers: [GradeFreezeService],
  exports: [GradeFreezeService],
})
export class GradeFreezeModule {}
