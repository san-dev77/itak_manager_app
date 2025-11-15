import { Repository } from 'typeorm';
import { Student } from '../../entities/student.entity';
import { User } from '../../entities/user.entity';
import { CreateStudentDto, UpdateStudentDto, StudentResponseDto } from './dto/student.dto';
export declare class StudentService {
    private readonly studentRepository;
    private readonly userRepository;
    constructor(studentRepository: Repository<Student>, userRepository: Repository<User>);
    createStudent(createStudentDto: CreateStudentDto): Promise<StudentResponseDto>;
    getAllStudents(): Promise<StudentResponseDto[]>;
    getStudentById(id: string): Promise<StudentResponseDto>;
    getStudentByUserId(userId: string): Promise<StudentResponseDto>;
    getStudentByMatricule(matricule: string): Promise<StudentResponseDto>;
    updateStudent(id: string, updateStudentDto: UpdateStudentDto): Promise<StudentResponseDto>;
    deleteStudent(id: string): Promise<{
        message: string;
    }>;
    private mapToStudentResponseDto;
}
