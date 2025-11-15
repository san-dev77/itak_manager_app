import { Repository } from 'typeorm';
import { Discount } from '../../entities/discount.entity';
import { StudentFee } from '../../entities/student-fee.entity';
import { User } from '../../entities/user.entity';
import { CreateDiscountDto, UpdateDiscountDto } from './dto/discount.dto';
export declare class DiscountService {
    private readonly discountRepository;
    private readonly studentFeeRepository;
    private readonly userRepository;
    constructor(discountRepository: Repository<Discount>, studentFeeRepository: Repository<StudentFee>, userRepository: Repository<User>);
    create(createDiscountDto: CreateDiscountDto): Promise<Discount>;
    findAll(): Promise<Discount[]>;
    findOne(id: string): Promise<Discount>;
    findByStudentFee(studentFeeId: string): Promise<Discount[]>;
    update(id: string, updateDiscountDto: UpdateDiscountDto): Promise<Discount>;
    remove(id: string): Promise<void>;
}
