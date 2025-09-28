import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefundService } from './refund.service';
import { RefundController } from './refund.controller';
import { Refund } from '../../entities/refund.entity';
import { Payment } from '../../entities/payment.entity';
import { User } from '../../entities/user.entity';
import { StudentFee } from '../../entities/student-fee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Refund, Payment, User, StudentFee])],
  controllers: [RefundController],
  providers: [RefundService],
  exports: [RefundService],
})
export class RefundModule {}
