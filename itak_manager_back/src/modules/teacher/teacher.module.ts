import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';
import { Teacher } from '../../entities/teacher.entity';
import { User } from '../../entities/user.entity';
import { Subject } from '../../entities/subject.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Teacher, User, Subject])],
  controllers: [TeacherController],
  providers: [TeacherService],
  exports: [TeacherService],
})
export class TeacherModule {}
