import { StudentService } from '../services/student.service';
import { CreateStudentDto, UpdateStudentDto } from '../dto/student.dto';
import type { StudentResponse } from '../models/student.model';
export declare class StudentController {
    private readonly studentService;
    constructor(studentService: StudentService);
    createStudent(createStudentDto: CreateStudentDto): Promise<StudentResponse>;
    getAllStudents(): Promise<StudentResponse[]>;
    getStudentById(id: string): Promise<StudentResponse>;
    getStudentByUserId(userId: string): Promise<StudentResponse>;
    getStudentByMatricule(matricule: string): Promise<StudentResponse>;
    updateStudent(id: string, updateStudentDto: UpdateStudentDto): Promise<StudentResponse>;
    deleteStudent(id: string): Promise<{
        message: string;
    }>;
}
