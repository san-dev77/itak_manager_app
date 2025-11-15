import { Repository } from 'typeorm';
import { FeeType } from '../../entities/fee-type.entity';
import { CreateFeeTypeDto, UpdateFeeTypeDto } from './dto/fee-type.dto';
export declare class FeeTypeService {
    private readonly feeTypeRepository;
    constructor(feeTypeRepository: Repository<FeeType>);
    create(createFeeTypeDto: CreateFeeTypeDto): Promise<FeeType>;
    findAll(): Promise<FeeType[]>;
    findOne(id: string): Promise<FeeType>;
    update(id: string, updateFeeTypeDto: UpdateFeeTypeDto): Promise<FeeType>;
    remove(id: string): Promise<void>;
    findByName(name: string): Promise<FeeType | null>;
    findRecurringFeeTypes(): Promise<FeeType[]>;
}
