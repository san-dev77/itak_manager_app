import { SubjectService } from '../services/subject.service';
import { CreateSubjectDto, UpdateSubjectDto } from '../dto/subject.dto';
import type { SubjectResponse } from '../models/subject.model';
export declare class SubjectController {
    private readonly subjectService;
    constructor(subjectService: SubjectService);
    createSubject(createSubjectDto: CreateSubjectDto): Promise<SubjectResponse>;
    getAllSubjects(): Promise<SubjectResponse[]>;
    getSubjectById(id: string): Promise<SubjectResponse>;
    getSubjectByCode(code: string): Promise<SubjectResponse>;
    getSubjectsByName(name: string): Promise<SubjectResponse[]>;
    getSubjectsByCategory(categoryId: string): Promise<SubjectResponse[]>;
    updateSubject(id: string, updateSubjectDto: UpdateSubjectDto): Promise<SubjectResponse>;
    deleteSubject(id: string): Promise<{
        message: string;
    }>;
}
