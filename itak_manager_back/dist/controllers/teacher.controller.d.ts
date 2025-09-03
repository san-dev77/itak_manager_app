import { TeacherService } from '../services/teacher.service';
import { CreateTeacherDto, UpdateTeacherDto } from '../dto/teacher.dto';
import type { TeacherResponse } from '../models/teacher.model';
export declare class TeacherController {
    private readonly teacherService;
    constructor(teacherService: TeacherService);
    createTeacher(createTeacherDto: CreateTeacherDto): Promise<TeacherResponse>;
    getAllTeachers(): Promise<TeacherResponse[]>;
    getTeacherById(id: string): Promise<TeacherResponse>;
    getTeacherByUserId(userId: string): Promise<TeacherResponse>;
    getTeacherByMatricule(matricule: string): Promise<TeacherResponse>;
    getTeachersBySpecialty(specialty: string): Promise<TeacherResponse[]>;
    updateTeacher(id: string, updateTeacherDto: UpdateTeacherDto): Promise<TeacherResponse>;
    deleteTeacher(id: string): Promise<{
        message: string;
    }>;
}
