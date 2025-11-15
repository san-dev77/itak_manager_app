import { PromotionService } from './promotion.service';
import { CreatePromotionDto, BulkPromotionDto, PromotionResponseDto, NextClassResponseDto } from './dto/promotion.dto';
import { Class } from '../../entities/class.entity';
export declare class PromotionController {
    private readonly promotionService;
    constructor(promotionService: PromotionService);
    getNextClass(classId: string): Promise<NextClassResponseDto>;
    promoteStudent(createPromotionDto: CreatePromotionDto): Promise<PromotionResponseDto>;
    bulkPromoteClass(bulkPromotionDto: BulkPromotionDto): Promise<PromotionResponseDto[]>;
    getPromotionHistory(studentId: string): Promise<PromotionResponseDto[]>;
    getClassesByOrderLevel(categoryId: string): Promise<Class[]>;
}
