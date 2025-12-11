import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentTransferService } from './student-transfer.service';
import { StudentTransferController } from './student-transfer.controller';
import { StudentTransfer } from '../../entities/student-transfer.entity';
import { StudentClass } from '../../entities/student-class.entity';
import { Student } from '../../entities/student.entity';
import { Class } from '../../entities/class.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentTransfer, StudentClass, Student, Class]),
  ],
  controllers: [StudentTransferController],
  providers: [StudentTransferService],
  exports: [StudentTransferService],
})
export class StudentTransferModule {}
