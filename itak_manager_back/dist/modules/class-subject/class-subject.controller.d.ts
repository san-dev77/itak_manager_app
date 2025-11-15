import { ClassSubjectService } from './class-subject.service';
import { CreateClassSubjectDto, UpdateClassSubjectDto, ClassSubjectResponseDto } from './dto/class-subject.dto';
export declare class ClassSubjectController {
    private readonly classSubjectService;
    constructor(classSubjectService: ClassSubjectService);
    create(createClassSubjectDto: CreateClassSubjectDto): Promise<ClassSubjectResponseDto>;
    findAll(): Promise<ClassSubjectResponseDto[]>;
    findByClass(classId: string): Promise<ClassSubjectResponseDto[]>;
    findBySubject(subjectId: string): Promise<ClassSubjectResponseDto[]>;
    findOne(id: string): Promise<ClassSubjectResponseDto>;
    update(id: string, updateClassSubjectDto: UpdateClassSubjectDto): Promise<ClassSubjectResponseDto>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
