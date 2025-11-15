import { SubjectService } from './subject.service';
import { CreateSubjectDto, UpdateSubjectDto, SubjectResponseDto } from './dto/subject.dto';
export declare class SubjectController {
    private readonly subjectService;
    constructor(subjectService: SubjectService);
    createSubject(createSubjectDto: CreateSubjectDto): Promise<SubjectResponseDto>;
    getAllSubjects(): Promise<SubjectResponseDto[]>;
    getSubjectById(id: string): Promise<SubjectResponseDto>;
    getSubjectByCode(code: string): Promise<SubjectResponseDto>;
    getSubjectsByName(name: string): Promise<SubjectResponseDto[]>;
    updateSubject(id: string, updateSubjectDto: UpdateSubjectDto): Promise<SubjectResponseDto>;
    deleteSubject(id: string): Promise<{
        message: string;
    }>;
}
