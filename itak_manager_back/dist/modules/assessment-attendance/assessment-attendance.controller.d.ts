import { AssessmentAttendanceService } from './assessment-attendance.service';
import { CreateAssessmentAttendanceDto } from './dto/create-assessment-attendance.dto';
import { UpdateAssessmentAttendanceDto } from './dto/update-assessment-attendance.dto';
import { BulkCreateAttendanceDto } from './dto/bulk-create-attendance.dto';
import { AttendanceStatus } from '../../entities/assessment-attendance.entity';
export declare class AssessmentAttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AssessmentAttendanceService);
    create(createDto: CreateAssessmentAttendanceDto): Promise<import("./dto/assessment-attendance-response.dto").AssessmentAttendanceResponseDto>;
    bulkCreate(bulkDto: BulkCreateAttendanceDto): Promise<import("./dto/assessment-attendance-response.dto").AssessmentAttendanceResponseDto[]>;
    findAll(assessmentId?: string, studentId?: string, status?: AttendanceStatus): Promise<import("./dto/assessment-attendance-response.dto").AssessmentAttendanceResponseDto[]>;
    findByAssessment(assessmentId: string): Promise<import("./dto/assessment-attendance-response.dto").AssessmentAttendanceResponseDto[]>;
    findByStudent(studentId: string): Promise<import("./dto/assessment-attendance-response.dto").AssessmentAttendanceResponseDto[]>;
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
    findOne(assessmentId: string, studentId: string): Promise<import("./dto/assessment-attendance-response.dto").AssessmentAttendanceResponseDto>;
    update(assessmentId: string, studentId: string, updateDto: UpdateAssessmentAttendanceDto): Promise<import("./dto/assessment-attendance-response.dto").AssessmentAttendanceResponseDto>;
    remove(assessmentId: string, studentId: string): Promise<void>;
}
