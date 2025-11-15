import { Repository } from 'typeorm';
import { ClassCategory } from '../../entities/class-category.entity';
import { ClassCategoryResponseDto, CreateClassCategoryDto, UpdateClassCategoryDto } from './dto/class-category.dto';
export declare class ClassCategoryService {
    private readonly classCategoryRepository;
    constructor(classCategoryRepository: Repository<ClassCategory>);
    createClassCategory(createClassCategoryDto: CreateClassCategoryDto): Promise<ClassCategoryResponseDto>;
    getAllClassCategories(): Promise<ClassCategoryResponseDto[]>;
    getClassCategoryById(id: string): Promise<ClassCategoryResponseDto>;
    getClassCategoryByName(name: string): Promise<ClassCategoryResponseDto>;
    updateClassCategory(id: string, updateClassCategoryDto: UpdateClassCategoryDto): Promise<ClassCategoryResponseDto>;
    deleteClassCategory(id: string): Promise<{
        message: string;
    }>;
    initializeDefaultCategories(): Promise<void>;
    private mapToClassCategory;
}
