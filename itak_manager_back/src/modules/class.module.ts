import { Module } from '@nestjs/common';
import { ClassController } from '../controllers/class.controller';
import { ClassService } from '../services/class.service';

@Module({
  controllers: [ClassController],
  providers: [ClassService],
  exports: [ClassService],
})
export class ClassModule {}
