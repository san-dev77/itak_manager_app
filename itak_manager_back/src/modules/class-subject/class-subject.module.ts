import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassSubjectService } from './class-subject.service';
import { ClassSubjectController } from './class-subject.controller';
import { ClassSubject } from '../../entities/class-subject.entity';
import { Class } from '../../entities/class.entity';
import { Subject } from '../../entities/subject.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClassSubject, Class, Subject])],
  controllers: [ClassSubjectController],
  providers: [ClassSubjectService],
  exports: [ClassSubjectService],
})
export class ClassSubjectModule {}
