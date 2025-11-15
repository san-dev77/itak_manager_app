"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceItemModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const invoice_item_service_1 = require("./invoice-item.service");
const invoice_item_controller_1 = require("./invoice-item.controller");
const invoice_item_entity_1 = require("../../entities/invoice-item.entity");
const invoice_entity_1 = require("../../entities/invoice.entity");
const student_fee_entity_1 = require("../../entities/student-fee.entity");
let InvoiceItemModule = class InvoiceItemModule {
};
exports.InvoiceItemModule = InvoiceItemModule;
exports.InvoiceItemModule = InvoiceItemModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([invoice_item_entity_1.InvoiceItem, invoice_entity_1.Invoice, student_fee_entity_1.StudentFee])],
        controllers: [invoice_item_controller_1.InvoiceItemController],
        providers: [invoice_item_service_1.InvoiceItemService],
        exports: [invoice_item_service_1.InvoiceItemService],
    })
], InvoiceItemModule);
//# sourceMappingURL=invoice-item.module.js.map