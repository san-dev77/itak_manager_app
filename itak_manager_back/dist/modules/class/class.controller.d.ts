import { ClassService } from './class.service';
import { CreateClassDto, UpdateClassDto } from './dto/class.dto';
import { ClassResponseDto } from './dto/class.dto';
export declare class ClassController {
    private readonly classService;
    constructor(classService: ClassService);
    createClass(createClassDto: CreateClassDto): Promise<ClassResponseDto>;
    getAllClasses(): Promise<ClassResponseDto[]>;
    getClassById(id: string): Promise<ClassResponseDto>;
    getClassesByCategory(categoryId: string): Promise<ClassResponseDto[]>;
    getClassesByLevel(level: string): Promise<ClassResponseDto[]>;
    updateClass(id: string, updateClassDto: UpdateClassDto): Promise<ClassResponseDto>;
    deleteClass(id: string): Promise<{
        message: string;
    }>;
}
