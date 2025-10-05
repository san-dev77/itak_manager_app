import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeachingAssignmentService } from './teaching-assignment.service';
import { TeachingAssignmentController } from './teaching-assignment.controller';
import { TeachingAssignment } from '../../entities/teaching-assignment.entity';
import { Teacher } from '../../entities/teacher.entity';
import { ClassSubject } from '../../entities/class-subject.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TeachingAssignment, Teacher, ClassSubject]),
  ],
  controllers: [TeachingAssignmentController],
  providers: [TeachingAssignmentService],
  exports: [TeachingAssignmentService],
})
export class TeachingAssignmentModule {}
