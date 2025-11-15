import { StudentService } from './student.service';
import { CreateStudentDto, UpdateStudentDto, StudentResponseDto } from './dto/student.dto';
export declare class StudentController {
    private readonly studentService;
    constructor(studentService: StudentService);
    createStudent(createStudentDto: CreateStudentDto): Promise<StudentResponseDto>;
    getAllStudents(): Promise<StudentResponseDto[]>;
    getStudentById(id: string): Promise<StudentResponseDto>;
    getStudentByUserId(userId: string): Promise<StudentResponseDto>;
    getStudentByMatricule(matricule: string): Promise<StudentResponseDto>;
    updateStudent(id: string, updateStudentDto: UpdateStudentDto): Promise<StudentResponseDto>;
    deleteStudent(id: string): Promise<{
        message: string;
    }>;
}
