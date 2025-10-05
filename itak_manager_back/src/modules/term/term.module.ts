import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TermController } from './term.controller';
import { TermService } from './term.service';
import { Term } from '../../entities/term.entity';
import { SchoolYear } from '../../entities/school-year.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Term, SchoolYear])],
  controllers: [TermController],
  providers: [TermService],
  exports: [TermService],
})
export class TermModule {}
