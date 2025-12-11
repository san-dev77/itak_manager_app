import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentFeeService } from './student-fee.service';
import { StudentFeeController } from './student-fee.controller';
import { StudentFee } from '../../entities/student-fee.entity';
import { Student } from '../../entities/student.entity';
import { FeeType } from '../../entities/fee-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudentFee, Student, FeeType])],
  controllers: [StudentFeeController],
  providers: [StudentFeeService],
  exports: [StudentFeeService],
})
export class StudentFeeModule {}
