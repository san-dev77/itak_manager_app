import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromotionController } from './promotion.controller';
import { PromotionService } from './promotion.service';
import { Class } from '../../entities/class.entity';
import { Student } from '../../entities/student.entity';
import { StudentClass } from '../../entities/student-class.entity';
import { StudentPromotion } from '../../entities/student-promotion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Class, Student, StudentClass, StudentPromotion]),
  ],
  controllers: [PromotionController],
  providers: [PromotionService],
  exports: [PromotionService],
})
export class PromotionModule {}
