import { TeacherResponse, CreateTeacherDto, UpdateTeacherDto } from '../models/teacher.model';
export declare class TeacherService {
    private readonly tableName;
    createTeacher(createTeacherDto: CreateTeacherDto): Promise<TeacherResponse>;
    getAllTeachers(): Promise<TeacherResponse[]>;
    getTeacherById(id: number): Promise<TeacherResponse>;
    getTeacherByUserId(userId: number): Promise<TeacherResponse>;
    getTeacherByMatricule(matricule: string): Promise<TeacherResponse>;
    getTeachersBySpecialty(specialty: string): Promise<TeacherResponse[]>;
    updateTeacher(id: number, updateTeacherDto: UpdateTeacherDto): Promise<TeacherResponse>;
    deleteTeacher(id: number): Promise<{
        message: string;
    }>;
    private mapToTeacherResponse;
}
