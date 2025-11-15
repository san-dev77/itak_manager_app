import { Repository } from 'typeorm';
import { Class } from '../../entities/class.entity';
import { Student } from '../../entities/student.entity';
import { StudentClass } from '../../entities/student-class.entity';
import { StudentPromotion } from '../../entities/student-promotion.entity';
import { CreatePromotionDto, BulkPromotionDto, PromotionResponseDto, NextClassResponseDto } from './dto/promotion.dto';
export declare class PromotionService {
    private classRepository;
    private studentRepository;
    private studentClassRepository;
    private studentPromotionRepository;
    constructor(classRepository: Repository<Class>, studentRepository: Repository<Student>, studentClassRepository: Repository<StudentClass>, studentPromotionRepository: Repository<StudentPromotion>);
    getNextClass(currentClassId: string): Promise<NextClassResponseDto>;
    promoteStudent(createPromotionDto: CreatePromotionDto): Promise<PromotionResponseDto>;
    bulkPromoteClass(bulkPromotionDto: BulkPromotionDto): Promise<PromotionResponseDto[]>;
    getPromotionHistory(studentId: string): Promise<PromotionResponseDto[]>;
    getClassesByOrderLevel(categoryId: string): Promise<Class[]>;
}
