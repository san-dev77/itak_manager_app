import { ClassResponse, CreateClassDto, UpdateClassDto } from '../models/class.model';
export declare class ClassService {
    private readonly tableName;
    createClass(createClassDto: CreateClassDto): Promise<ClassResponse>;
    getAllClasses(): Promise<ClassResponse[]>;
    getClassById(id: number): Promise<ClassResponse>;
    getClassesByCategory(categoryId: number): Promise<ClassResponse[]>;
    getClassesByLevel(level: string): Promise<ClassResponse[]>;
    updateClass(id: number, updateClassDto: UpdateClassDto): Promise<ClassResponse>;
    deleteClass(id: number): Promise<{
        message: string;
    }>;
    private mapToClassResponse;
}
