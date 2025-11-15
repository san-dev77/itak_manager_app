import { ClassCategoryService } from './class-category.service';
import { CreateClassCategoryDto, UpdateClassCategoryDto, ClassCategoryResponseDto } from './dto/class-category.dto';
export declare class ClassCategoryController {
    private readonly classCategoryService;
    constructor(classCategoryService: ClassCategoryService);
    createClassCategory(createClassCategoryDto: CreateClassCategoryDto): Promise<ClassCategoryResponseDto>;
    getAllClassCategories(): Promise<ClassCategoryResponseDto[]>;
    getClassCategoryById(id: string): Promise<ClassCategoryResponseDto>;
    updateClassCategory(id: string, updateClassCategoryDto: UpdateClassCategoryDto): Promise<ClassCategoryResponseDto>;
    deleteClassCategory(id: string): Promise<{
        message: string;
    }>;
    initializeDefaultCategories(): Promise<{
        message: string;
    }>;
}
