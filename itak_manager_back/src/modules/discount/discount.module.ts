import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';
import { Discount } from '../../entities/discount.entity';
import { StudentFee } from '../../entities/student-fee.entity';
import { User } from '../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Discount, StudentFee, User])],
  controllers: [DiscountController],
  providers: [DiscountService],
  exports: [DiscountService],
})
export class DiscountModule {}
