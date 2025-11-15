import { Repository } from 'typeorm';
import { Parent } from '../../entities/parent.entity';
import { User } from '../../entities/user.entity';
import { Student } from '../../entities/student.entity';
import { StudentParent } from '../../entities/student-parent.entity';
import { CreateParentDto, UpdateParentDto, ParentResponseDto, CreateStudentParentDto, StudentParentResponseDto } from './dto/parent.dto';
export declare class ParentService {
    private parentRepository;
    private userRepository;
    private studentRepository;
    private studentParentRepository;
    constructor(parentRepository: Repository<Parent>, userRepository: Repository<User>, studentRepository: Repository<Student>, studentParentRepository: Repository<StudentParent>);
    createParent(createParentDto: CreateParentDto): Promise<ParentResponseDto>;
    getAllParents(): Promise<ParentResponseDto[]>;
    getParentById(id: string): Promise<ParentResponseDto>;
    updateParent(id: string, updateParentDto: UpdateParentDto): Promise<ParentResponseDto>;
    deleteParent(id: string): Promise<void>;
    linkStudentToParent(createStudentParentDto: CreateStudentParentDto): Promise<StudentParentResponseDto>;
    getStudentParents(studentId: string): Promise<StudentParentResponseDto[]>;
    private mapToParentResponse;
    private mapToStudentParentResponse;
}
