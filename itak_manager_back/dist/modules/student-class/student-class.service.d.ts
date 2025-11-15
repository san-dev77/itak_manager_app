import { Repository } from 'typeorm';
import { StudentClass } from '../../entities/student-class.entity';
import { Student } from '../../entities/student.entity';
import { Class } from '../../entities/class.entity';
import { StudentClassResponseDto } from './dto/student-class.dto';
import { CreateStudentClassDto, UpdateStudentClassDto } from './dto/student-class.dto';
export declare class StudentClassService {
    private readonly studentClassRepository;
    private readonly studentRepository;
    private readonly classRepository;
    constructor(studentClassRepository: Repository<StudentClass>, studentRepository: Repository<Student>, classRepository: Repository<Class>);
    createStudentClass(createStudentClassDto: CreateStudentClassDto): Promise<StudentClassResponseDto>;
    getAllStudentClasses(): Promise<StudentClassResponseDto[]>;
    getStudentClassById(id: string): Promise<StudentClassResponseDto>;
    getStudentClassesByStudent(studentId: string): Promise<StudentClassResponseDto[]>;
    getStudentClassesByClass(classId: string): Promise<StudentClassResponseDto[]>;
    updateStudentClass(id: string, updateStudentClassDto: UpdateStudentClassDto): Promise<StudentClassResponseDto>;
    deleteStudentClass(id: string): Promise<{
        message: string;
    }>;
    private mapToStudentClassResponseDto;
}
