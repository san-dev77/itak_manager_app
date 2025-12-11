import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassController } from './class.controller';
import { ClassService } from './class.service';
import { Class } from '../../entities/class.entity';
import { ClassCategory } from '../../entities/class-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Class, ClassCategory])],
  controllers: [ClassController],
  providers: [ClassService],
  exports: [ClassService],
})
export class ClassModule {}
