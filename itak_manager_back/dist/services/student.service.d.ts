import { StudentResponse, CreateStudentDto, UpdateStudentDto } from '../models/student.model';
export declare class StudentService {
    private readonly tableName;
    createStudent(createStudentDto: CreateStudentDto): Promise<StudentResponse>;
    getAllStudents(): Promise<StudentResponse[]>;
    getStudentById(id: number): Promise<StudentResponse>;
    getStudentByUserId(userId: number): Promise<StudentResponse>;
    getStudentByMatricule(matricule: string): Promise<StudentResponse>;
    updateStudent(id: number, updateStudentDto: UpdateStudentDto): Promise<StudentResponse>;
    deleteStudent(id: number): Promise<{
        message: string;
    }>;
    private mapToStudentResponse;
}
