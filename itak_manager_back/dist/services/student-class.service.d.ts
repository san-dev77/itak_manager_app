import { StudentClassResponse, CreateStudentClassDto, UpdateStudentClassDto } from '../models/student-class.model';
export declare class StudentClassService {
    private readonly tableName;
    createStudentClass(createStudentClassDto: CreateStudentClassDto): Promise<StudentClassResponse>;
    getAllStudentClasses(): Promise<StudentClassResponse[]>;
    getStudentClassById(id: number): Promise<StudentClassResponse>;
    getStudentClassesByStudent(studentId: number): Promise<StudentClassResponse[]>;
    getStudentClassesByClass(classId: number): Promise<StudentClassResponse[]>;
    updateStudentClass(id: number, updateStudentClassDto: UpdateStudentClassDto): Promise<StudentClassResponse>;
    deleteStudentClass(id: number): Promise<{
        message: string;
    }>;
    private mapToStudentClassResponse;
}
