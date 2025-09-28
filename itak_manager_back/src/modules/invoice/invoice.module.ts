import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { Invoice } from '../../entities/invoice.entity';
import { Student } from '../../entities/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, Student])],
  controllers: [InvoiceController],
  providers: [InvoiceService],
  exports: [InvoiceService],
})
export class InvoiceModule {}
