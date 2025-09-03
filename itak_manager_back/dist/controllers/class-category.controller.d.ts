import { ClassCategoryService } from '../services/class-category.service';
import { CreateClassCategoryDto, UpdateClassCategoryDto } from '../dto/class-category.dto';
import type { ClassCategoryResponse } from '../models/class-category.model';
export declare class ClassCategoryController {
    private readonly classCategoryService;
    constructor(classCategoryService: ClassCategoryService);
    createClassCategory(createClassCategoryDto: CreateClassCategoryDto): Promise<ClassCategoryResponse>;
    getAllClassCategories(): Promise<ClassCategoryResponse[]>;
    getClassCategoryById(id: string): Promise<ClassCategoryResponse>;
    updateClassCategory(id: string, updateClassCategoryDto: UpdateClassCategoryDto): Promise<ClassCategoryResponse>;
    deleteClassCategory(id: string): Promise<{
        message: string;
    }>;
    initializeDefaultCategories(): Promise<{
        message: string;
    }>;
}
