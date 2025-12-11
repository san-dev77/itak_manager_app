import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceItemService } from './invoice-item.service';
import { InvoiceItemController } from './invoice-item.controller';
import { InvoiceItem } from '../../entities/invoice-item.entity';
import { Invoice } from '../../entities/invoice.entity';
import { StudentFee } from '../../entities/student-fee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InvoiceItem, Invoice, StudentFee])],
  controllers: [InvoiceItemController],
  providers: [InvoiceItemService],
  exports: [InvoiceItemService],
})
export class InvoiceItemModule {}
