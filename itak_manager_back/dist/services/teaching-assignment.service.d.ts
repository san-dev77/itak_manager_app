import { TeachingAssignmentResponse, CreateTeachingAssignmentDto, UpdateTeachingAssignmentDto } from '../models/teaching-assignment.model';
export declare class TeachingAssignmentService {
    private readonly tableName;
    createTeachingAssignment(createTeachingAssignmentDto: CreateTeachingAssignmentDto): Promise<TeachingAssignmentResponse>;
    getAllTeachingAssignments(): Promise<TeachingAssignmentResponse[]>;
    getTeachingAssignmentById(id: number): Promise<TeachingAssignmentResponse>;
    getTeachingAssignmentsByTeacher(teacherId: number): Promise<TeachingAssignmentResponse[]>;
    getTeachingAssignmentsByClassSubject(classSubjectId: number): Promise<TeachingAssignmentResponse[]>;
    updateTeachingAssignment(id: number, updateTeachingAssignmentDto: UpdateTeachingAssignmentDto): Promise<TeachingAssignmentResponse>;
    deleteTeachingAssignment(id: number): Promise<{
        message: string;
    }>;
    private mapToTeachingAssignmentResponse;
}
