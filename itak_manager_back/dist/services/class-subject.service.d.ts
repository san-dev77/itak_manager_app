import { ClassSubjectResponse, CreateClassSubjectDto, UpdateClassSubjectDto } from '../models/class-subject.model';
export declare class ClassSubjectService {
    private readonly tableName;
    createClassSubject(createClassSubjectDto: CreateClassSubjectDto): Promise<ClassSubjectResponse>;
    getAllClassSubjects(): Promise<ClassSubjectResponse[]>;
    getClassSubjectById(id: number): Promise<ClassSubjectResponse>;
    getClassSubjectsByClass(classId: number): Promise<ClassSubjectResponse[]>;
    getClassSubjectsBySubject(subjectId: number): Promise<ClassSubjectResponse[]>;
    updateClassSubject(id: number, updateClassSubjectDto: UpdateClassSubjectDto): Promise<ClassSubjectResponse>;
    deleteClassSubject(id: number): Promise<{
        message: string;
    }>;
    private mapToClassSubjectResponse;
}
