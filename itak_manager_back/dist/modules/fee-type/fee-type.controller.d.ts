import { FeeTypeService } from './fee-type.service';
import { CreateFeeTypeDto, UpdateFeeTypeDto } from './dto/fee-type.dto';
export declare class FeeTypeController {
    private readonly feeTypeService;
    constructor(feeTypeService: FeeTypeService);
    create(createFeeTypeDto: CreateFeeTypeDto): Promise<import("../../entities/fee-type.entity").FeeType>;
    findAll(): Promise<import("../../entities/fee-type.entity").FeeType[]>;
    findRecurring(): Promise<import("../../entities/fee-type.entity").FeeType[]>;
    findOne(id: string): Promise<import("../../entities/fee-type.entity").FeeType>;
    update(id: string, updateFeeTypeDto: UpdateFeeTypeDto): Promise<import("../../entities/fee-type.entity").FeeType>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
