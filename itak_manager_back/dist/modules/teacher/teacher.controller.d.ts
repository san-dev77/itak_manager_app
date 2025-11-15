import { TeacherService } from './teacher.service';
import { CreateTeacherDto, UpdateTeacherDto, TeacherResponseDto } from './dto/teacher.dto';
export declare class TeacherController {
    private readonly teacherService;
    constructor(teacherService: TeacherService);
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
}
