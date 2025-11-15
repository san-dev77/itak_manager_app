import { DiscountService } from './discount.service';
import { CreateDiscountDto, UpdateDiscountDto } from './dto/discount.dto';
export declare class DiscountController {
    private readonly discountService;
    constructor(discountService: DiscountService);
    create(createDiscountDto: CreateDiscountDto): Promise<import("../../entities/discount.entity").Discount>;
    findAll(): Promise<import("../../entities/discount.entity").Discount[]>;
    findByStudentFee(studentFeeId: string): Promise<import("../../entities/discount.entity").Discount[]>;
    findOne(id: string): Promise<import("../../entities/discount.entity").Discount>;
    update(id: string, updateDiscountDto: UpdateDiscountDto): Promise<import("../../entities/discount.entity").Discount>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
