import { TeachingAssignmentService } from './teaching-assignment.service';
import { CreateTeachingAssignmentDto, UpdateTeachingAssignmentDto, TeachingAssignmentResponseDto } from './dto/teaching-assignment.dto';
export declare class TeachingAssignmentController {
    private readonly teachingAssignmentService;
    constructor(teachingAssignmentService: TeachingAssignmentService);
    create(createTeachingAssignmentDto: CreateTeachingAssignmentDto): Promise<TeachingAssignmentResponseDto>;
    findAll(): Promise<TeachingAssignmentResponseDto[]>;
    findByTeacher(teacherId: string): Promise<TeachingAssignmentResponseDto[]>;
    findByClassSubject(classSubjectId: string): Promise<TeachingAssignmentResponseDto[]>;
    findOne(id: string): Promise<TeachingAssignmentResponseDto>;
    update(id: string, updateTeachingAssignmentDto: UpdateTeachingAssignmentDto): Promise<TeachingAssignmentResponseDto>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
