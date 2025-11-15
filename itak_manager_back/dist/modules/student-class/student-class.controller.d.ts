import { StudentClassService } from './student-class.service';
import { CreateStudentClassDto, UpdateStudentClassDto, StudentClassResponseDto } from './dto/student-class.dto';
export declare class StudentClassController {
    private readonly studentClassService;
    constructor(studentClassService: StudentClassService);
    create(createStudentClassDto: CreateStudentClassDto): Promise<StudentClassResponseDto>;
    findAll(): Promise<StudentClassResponseDto[]>;
    findByStudent(studentId: string): Promise<StudentClassResponseDto[]>;
    findByClass(classId: string): Promise<StudentClassResponseDto[]>;
    findOne(id: string): Promise<StudentClassResponseDto>;
    update(id: string, updateStudentClassDto: UpdateStudentClassDto): Promise<StudentClassResponseDto>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
