import { GradeComplaintService } from './grade-complaint.service';
import { CreateGradeComplaintDto, UpdateGradeComplaintStatusDto, GradeComplaintResponseDto, GradeComplaintHistoryResponseDto } from './dto/grade-complaint.dto';
export declare class GradeComplaintController {
    private readonly gradeComplaintService;
    constructor(gradeComplaintService: GradeComplaintService);
    create(createGradeComplaintDto: CreateGradeComplaintDto): Promise<GradeComplaintResponseDto>;
    findAll(studentId?: string, assessmentId?: string): Promise<GradeComplaintResponseDto[]>;
    findOne(id: string): Promise<GradeComplaintResponseDto>;
    findByStudent(studentId: string): Promise<GradeComplaintResponseDto[]>;
    findByAssessment(assessmentId: string): Promise<GradeComplaintResponseDto[]>;
    getHistory(id: string): Promise<GradeComplaintHistoryResponseDto[]>;
    updateStatus(id: string, updateStatusDto: UpdateGradeComplaintStatusDto, req: any): Promise<GradeComplaintResponseDto>;
    remove(id: string): Promise<void>;
}
