import { SubjectResponse, CreateSubjectDto, UpdateSubjectDto } from '../models/subject.model';
export declare class SubjectService {
    private readonly tableName;
    createSubject(createSubjectDto: CreateSubjectDto): Promise<SubjectResponse>;
    getAllSubjects(): Promise<SubjectResponse[]>;
    getSubjectById(id: number): Promise<SubjectResponse>;
    getSubjectByCode(code: string): Promise<SubjectResponse>;
    getSubjectsByName(name: string): Promise<SubjectResponse[]>;
    getSubjectsByCategory(categoryId: number): Promise<SubjectResponse[]>;
    updateSubject(id: number, updateSubjectDto: UpdateSubjectDto): Promise<SubjectResponse>;
    deleteSubject(id: number): Promise<{
        message: string;
    }>;
    private mapToSubjectResponse;
}
