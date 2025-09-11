import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassCategoryController } from './class-category.controller';
import { ClassCategoryService } from './class-category.service';
import { ClassCategory } from '../../entities/class-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClassCategory])],
  controllers: [ClassCategoryController],
  providers: [ClassCategoryService],
  exports: [ClassCategoryService],
})
export class ClassCategoryModule {}
