import { Repository } from 'typeorm';
import { TeachingAssignment } from '../../entities/teaching-assignment.entity';
import { Teacher } from '../../entities/teacher.entity';
import { ClassSubject } from '../../entities/class-subject.entity';
import { TeachingAssignmentResponseDto } from './dto/teaching-assignment.dto';
import { CreateTeachingAssignmentDto, UpdateTeachingAssignmentDto } from './dto/teaching-assignment.dto';
export declare class TeachingAssignmentService {
    private readonly teachingAssignmentRepository;
    private readonly teacherRepository;
    private readonly classSubjectRepository;
    constructor(teachingAssignmentRepository: Repository<TeachingAssignment>, teacherRepository: Repository<Teacher>, classSubjectRepository: Repository<ClassSubject>);
    createTeachingAssignment(createTeachingAssignmentDto: CreateTeachingAssignmentDto): Promise<TeachingAssignmentResponseDto>;
    getAllTeachingAssignments(): Promise<TeachingAssignmentResponseDto[]>;
    getTeachingAssignmentById(id: string): Promise<TeachingAssignmentResponseDto>;
    getTeachingAssignmentsByTeacher(teacherId: string): Promise<TeachingAssignmentResponseDto[]>;
    getTeachingAssignmentsByClassSubject(classSubjectId: string): Promise<TeachingAssignmentResponseDto[]>;
    updateTeachingAssignment(id: string, updateTeachingAssignmentDto: UpdateTeachingAssignmentDto): Promise<TeachingAssignmentResponseDto>;
    deleteTeachingAssignment(id: string): Promise<{
        message: string;
    }>;
    private mapToTeachingAssignmentResponseDto;
}
