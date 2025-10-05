import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParentController } from './parent.controller';
import { ParentService } from './parent.service';
import { Parent } from '../../entities/parent.entity';
import { User } from '../../entities/user.entity';
import { Student } from '../../entities/student.entity';
import { StudentParent } from '../../entities/student-parent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Parent, User, Student, StudentParent])],
  controllers: [ParentController],
  providers: [ParentService],
  exports: [ParentService],
})
export class ParentModule {}
