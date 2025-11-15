import { Repository } from 'typeorm';
import { Subject } from '../../entities/subject.entity';
import { CreateSubjectDto, UpdateSubjectDto, SubjectResponseDto } from './dto/subject.dto';
export declare class SubjectService {
    private readonly subjectRepository;
    constructor(subjectRepository: Repository<Subject>);
    createSubject(createSubjectDto: CreateSubjectDto): Promise<SubjectResponseDto>;
    getAllSubjects(): Promise<SubjectResponseDto[]>;
    getSubjectById(id: string): Promise<SubjectResponseDto>;
    getSubjectByCode(code: string): Promise<SubjectResponseDto>;
    getSubjectsByName(name: string): Promise<SubjectResponseDto[]>;
    updateSubject(id: string, updateSubjectDto: UpdateSubjectDto): Promise<SubjectResponseDto>;
    deleteSubject(id: string): Promise<{
        message: string;
    }>;
    private mapToSubjectResponseDto;
}
