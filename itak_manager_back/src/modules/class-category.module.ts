import { Module } from '@nestjs/common';
import { ClassCategoryController } from '../controllers/class-category.controller';
import { ClassCategoryService } from '../services/class-category.service';

@Module({
  controllers: [ClassCategoryController],
  providers: [ClassCategoryService],
  exports: [ClassCategoryService],
})
export class ClassCategoryModule {}
