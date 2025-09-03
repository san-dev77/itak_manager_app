import { ClassCategoryResponse, CreateClassCategoryDto, UpdateClassCategoryDto } from '../models/class-category.model';
export declare class ClassCategoryService {
    private readonly tableName;
    createClassCategory(createClassCategoryDto: CreateClassCategoryDto): Promise<ClassCategoryResponse>;
    getAllClassCategories(): Promise<ClassCategoryResponse[]>;
    getClassCategoryById(id: number): Promise<ClassCategoryResponse>;
    updateClassCategory(id: number, updateClassCategoryDto: UpdateClassCategoryDto): Promise<ClassCategoryResponse>;
    deleteClassCategory(id: number): Promise<{
        message: string;
    }>;
    initializeDefaultCategories(): Promise<void>;
    private mapToClassCategoryResponse;
}
