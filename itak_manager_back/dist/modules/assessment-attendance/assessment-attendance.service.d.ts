import { Repository } from 'typeorm';
import { AssessmentAttendance, AttendanceStatus } from '../../entities/assessment-attendance.entity';
import { Assessment } from '../../entities/assessment.entity';
import { Student } from '../../entities/student.entity';
import { CreateAssessmentAttendanceDto } from './dto/create-assessment-attendance.dto';
import { UpdateAssessmentAttendanceDto } from './dto/update-assessment-attendance.dto';
import { AssessmentAttendanceResponseDto } from './dto/assessment-attendance-response.dto';
import { BulkCreateAttendanceDto } from './dto/bulk-create-attendance.dto';
export declare class AssessmentAttendanceService {
    private readonly attendanceRepository;
    private readonly assessmentRepository;
    private readonly studentRepository;
    constructor(attendanceRepository: Repository<AssessmentAttendance>, assessmentRepository: Repository<Assessment>, studentRepository: Repository<Student>);
    create(createDto: CreateAssessmentAttendanceDto): Promise<AssessmentAttendanceResponseDto>;
    bulkCreate(bulkDto: BulkCreateAttendanceDto): Promise<AssessmentAttendanceResponseDto[]>;
    findAll(filters?: {
        assessmentId?: string;
        studentId?: string;
        status?: AttendanceStatus;
    }): Promise<AssessmentAttendanceResponseDto[]>;
    findByAssessment(assessmentId: string): Promise<AssessmentAttendanceResponseDto[]>;
    findByStudent(studentId: string): Promise<AssessmentAttendanceResponseDto[]>;
    findOne(assessmentId: string, studentId: string): Promise<AssessmentAttendanceResponseDto>;
    update(assessmentId: string, studentId: string, updateDto: UpdateAssessmentAttendanceDto): Promise<AssessmentAttendanceResponseDto>;
    remove(assessmentId: string, studentId: string): Promise<void>;
    getAttendanceStats(assessmentId: string): Promise<{
        total: number;
        present: number;
        absent: number;
        excused: number;
        excluded: number;
        percentages: {
            present: number;
            absent: number;
            excused: number;
            excluded: number;
        };
    }>;
    private mapToResponseDto;
}
