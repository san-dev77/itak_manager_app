import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FeeType } from "./entities/fee-type.entity";
import { StudentFee } from "./entities/student-fee.entity";
import { Payment } from "./entities/payment.entity";
import { Invoice } from "./entities/invoice.entity";
import { InvoiceItem } from "./entities/invoice-item.entity";
import { Discount } from "./entities/discount.entity";
import { Refund } from "./entities/refund.entity";
import { FeeTypeService } from "./services/fee-type.service";
import { StudentFeeService } from "./services/student-fee.service";
import { PaymentService } from "./services/payment.service";
import { InvoiceService } from "./services/invoice.service";
import { InvoiceItemService } from "./services/invoice-item.service";
import { DiscountService } from "./services/discount.service";
import { RefundService } from "./services/refund.service";
import { FeeTypeController } from "./controllers/fee-type.controller";
import { StudentFeeController } from "./controllers/student-fee.controller";
import { PaymentController } from "./controllers/payment.controller";
import { InvoiceController } from "./controllers/invoice.controller";
import { InvoiceItemController } from "./controllers/invoice-item.controller";
import { DiscountController } from "./controllers/discount.controller";
import { RefundController } from "./controllers/refund.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FeeType,
      StudentFee,
      Payment,
      Invoice,
      InvoiceItem,
      Discount,
      Refund,
    ]),
  ],
  controllers: [
    FeeTypeController,
    StudentFeeController,
    PaymentController,
    InvoiceController,
    InvoiceItemController,
    DiscountController,
    RefundController,
  ],
  providers: [
    FeeTypeService,
    StudentFeeService,
    PaymentService,
    InvoiceService,
    InvoiceItemService,
    DiscountService,
    RefundService,
  ],
  exports: [
    FeeTypeService,
    StudentFeeService,
    PaymentService,
    InvoiceService,
    InvoiceItemService,
    DiscountService,
    RefundService,
  ],
})
export class FinanceModule {}
