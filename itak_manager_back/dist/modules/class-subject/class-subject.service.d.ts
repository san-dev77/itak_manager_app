import { Repository } from 'typeorm';
import { ClassSubject } from '../../entities/class-subject.entity';
import { Class } from '../../entities/class.entity';
import { Subject } from '../../entities/subject.entity';
import { CreateClassSubjectDto, UpdateClassSubjectDto, ClassSubjectResponseDto } from './dto/class-subject.dto';
export declare class ClassSubjectService {
    private readonly classSubjectRepository;
    private readonly classRepository;
    private readonly subjectRepository;
    constructor(classSubjectRepository: Repository<ClassSubject>, classRepository: Repository<Class>, subjectRepository: Repository<Subject>);
    createClassSubject(createClassSubjectDto: CreateClassSubjectDto): Promise<ClassSubjectResponseDto>;
    getAllClassSubjects(): Promise<ClassSubjectResponseDto[]>;
    getClassSubjectById(id: string): Promise<ClassSubjectResponseDto>;
    getClassSubjectsByClass(classId: string): Promise<ClassSubjectResponseDto[]>;
    getClassSubjectsBySubject(subjectId: string): Promise<ClassSubjectResponseDto[]>;
    updateClassSubject(id: string, updateClassSubjectDto: UpdateClassSubjectDto): Promise<ClassSubjectResponseDto>;
    deleteClassSubject(id: string): Promise<{
        message: string;
    }>;
    private mapToClassSubject;
}
