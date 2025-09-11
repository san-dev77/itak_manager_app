import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectController } from './subject.controller';
import { SubjectService } from './subject.service';
import { Subject } from '../../entities/subject.entity';
import { ClassCategory } from '../../entities/class-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subject, ClassCategory])],
  controllers: [SubjectController],
  providers: [SubjectService],
  exports: [SubjectService],
})
export class SubjectModule {}
