import { ClassService } from '../services/class.service';
import { CreateClassDto, UpdateClassDto } from '../dto/class.dto';
import type { ClassResponse } from '../models/class.model';
export declare class ClassController {
    private readonly classService;
    constructor(classService: ClassService);
    createClass(createClassDto: CreateClassDto): Promise<ClassResponse>;
    getAllClasses(): Promise<ClassResponse[]>;
    getClassById(id: string): Promise<ClassResponse>;
    getClassesByCategory(categoryId: string): Promise<ClassResponse[]>;
    getClassesByLevel(level: string): Promise<ClassResponse[]>;
    updateClass(id: string, updateClassDto: UpdateClassDto): Promise<ClassResponse>;
    deleteClass(id: string): Promise<{
        message: string;
    }>;
}
