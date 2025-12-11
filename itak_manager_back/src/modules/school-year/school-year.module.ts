import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolYearController } from './school-year.controller';
import { SchoolYearService } from './school-year.service';
import { SchoolYear } from '../../entities/school-year.entity';
import { Term } from '../../entities/term.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SchoolYear, Term])],
  controllers: [SchoolYearController],
  providers: [SchoolYearService],
  exports: [SchoolYearService],
})
export class SchoolYearModule {}
