import { Module } from '@nestjs/common';
import { TeacherController } from '../controllers/teacher.controller';
import { TeacherService } from '../services/teacher.service';

@Module({
  controllers: [TeacherController],
  providers: [TeacherService],
  exports: [TeacherService],
})
export class TeacherModule {}
