import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeeTypeService } from './fee-type.service';
import { FeeTypeController } from './fee-type.controller';
import { FeeType } from '../../entities/fee-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FeeType])],
  controllers: [FeeTypeController],
  providers: [FeeTypeService],
  exports: [FeeTypeService],
})
export class FeeTypeModule {}
