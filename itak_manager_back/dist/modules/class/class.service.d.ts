import { Repository } from 'typeorm';
import { Class } from '../../entities/class.entity';
import { ClassResponseDto, CreateClassDto, UpdateClassDto } from './dto/class.dto';
export declare class ClassService {
    private readonly classRepository;
    constructor(classRepository: Repository<Class>);
    createClass(createClassDto: CreateClassDto): Promise<ClassResponseDto>;
    getAllClasses(): Promise<ClassResponseDto[]>;
    getClassById(id: string): Promise<ClassResponseDto>;
    getClassByCode(code: string): Promise<ClassResponseDto>;
    getClassByName(name: string): Promise<ClassResponseDto>;
    updateClass(id: string, updateClassDto: UpdateClassDto): Promise<ClassResponseDto>;
    deleteClass(id: string): Promise<{
        message: string;
    }>;
    getClassesByCategory(categoryId: string): Promise<ClassResponseDto[]>;
    getClassesByLevel(level: string): Promise<ClassResponseDto[]>;
    private mapToClassResponseDto;
}
