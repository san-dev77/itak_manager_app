import { Repository } from 'typeorm';
import { Teacher } from '../../entities/teacher.entity';
import { User } from '../../entities/user.entity';
import { Subject } from '../../entities/subject.entity';
import { CreateTeacherDto, UpdateTeacherDto, TeacherResponseDto } from './dto/teacher.dto';
export declare class TeacherService {
    private teacherRepository;
    private userRepository;
    private subjectRepository;
    constructor(teacherRepository: Repository<Teacher>, userRepository: Repository<User>, subjectRepository: Repository<Subject>);
    createTeacher(createTeacherDto: CreateTeacherDto): Promise<TeacherResponseDto>;
    getAllTeachers(): Promise<TeacherResponseDto[]>;
    getTeacherById(id: string): Promise<TeacherResponseDto>;
    getTeacherByUserId(userId: string): Promise<TeacherResponseDto>;
    getTeacherByMatricule(matricule: string): Promise<TeacherResponseDto>;
    getTeachersBySubject(subjectId: string): Promise<TeacherResponseDto[]>;
    updateTeacher(id: string, updateTeacherDto: UpdateTeacherDto): Promise<TeacherResponseDto>;
    deleteTeacher(id: string): Promise<{
        message: string;
    }>;
    private mapToTeacherResponse;
}
