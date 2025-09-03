import { ClassSubjectService } from '../services/class-subject.service';
import { StudentClassService } from '../services/student-class.service';
import { TeachingAssignmentService } from '../services/teaching-assignment.service';
import { CreateClassSubjectDto, UpdateClassSubjectDto } from '../dto/class-subject.dto';
import { CreateStudentClassDto, UpdateStudentClassDto } from '../dto/student-class.dto';
import { CreateTeachingAssignmentDto, UpdateTeachingAssignmentDto } from '../dto/teaching-assignment.dto';
import type { ClassSubjectResponse } from '../models/class-subject.model';
import type { StudentClassResponse } from '../models/student-class.model';
import type { TeachingAssignmentResponse } from '../models/teaching-assignment.model';
export declare class ConfigController {
    private readonly classSubjectService;
    private readonly studentClassService;
    private readonly teachingAssignmentService;
    constructor(classSubjectService: ClassSubjectService, studentClassService: StudentClassService, teachingAssignmentService: TeachingAssignmentService);
    createClassSubject(createClassSubjectDto: CreateClassSubjectDto): Promise<ClassSubjectResponse>;
    getAllClassSubjects(): Promise<ClassSubjectResponse[]>;
    getClassSubjectById(id: string): Promise<ClassSubjectResponse>;
    getClassSubjectsByClass(classId: string): Promise<ClassSubjectResponse[]>;
    getClassSubjectsBySubject(subjectId: string): Promise<ClassSubjectResponse[]>;
    updateClassSubject(id: string, updateClassSubjectDto: UpdateClassSubjectDto): Promise<ClassSubjectResponse>;
    deleteClassSubject(id: string): Promise<{
        message: string;
    }>;
    createStudentClass(createStudentClassDto: CreateStudentClassDto): Promise<StudentClassResponse>;
    getAllStudentClasses(): Promise<StudentClassResponse[]>;
    getStudentClassById(id: string): Promise<StudentClassResponse>;
    getStudentClassesByStudent(studentId: string): Promise<StudentClassResponse[]>;
    getStudentClassesByClass(classId: string): Promise<StudentClassResponse[]>;
    updateStudentClass(id: string, updateStudentClassDto: UpdateStudentClassDto): Promise<StudentClassResponse>;
    deleteStudentClass(id: string): Promise<{
        message: string;
    }>;
    createTeachingAssignment(createTeachingAssignmentDto: CreateTeachingAssignmentDto): Promise<TeachingAssignmentResponse>;
    getAllTeachingAssignments(): Promise<TeachingAssignmentResponse[]>;
    getTeachingAssignmentById(id: string): Promise<TeachingAssignmentResponse>;
    getTeachingAssignmentsByTeacher(teacherId: string): Promise<TeachingAssignmentResponse[]>;
    getTeachingAssignmentsByClassSubject(classSubjectId: string): Promise<TeachingAssignmentResponse[]>;
    updateTeachingAssignment(id: string, updateTeachingAssignmentDto: UpdateTeachingAssignmentDto): Promise<TeachingAssignmentResponse>;
    deleteTeachingAssignment(id: string): Promise<{
        message: string;
    }>;
}
