import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentClassController } from './student-class.controller';
import { StudentClassService } from './student-class.service';
import { StudentClass } from '../../entities/student-class.entity';
import { Student } from '../../entities/student.entity';
import { Class } from '../../entities/class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudentClass, Student, Class])],
  controllers: [StudentClassController],
  providers: [StudentClassService],
  exports: [StudentClassService],
})
export class StudentClassModule {}
