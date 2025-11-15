import { Repository } from 'typeorm';
import { GradeComplaint } from '../../entities/grade-complaint.entity';
import { GradeComplaintHistory } from '../../entities/grade-complaint-history.entity';
import { Assessment } from '../../entities/assessment.entity';
import { Student } from '../../entities/student.entity';
import { AssessmentResult } from '../../entities/assessment-result.entity';
import { CreateGradeComplaintDto, UpdateGradeComplaintStatusDto, GradeComplaintResponseDto, GradeComplaintHistoryResponseDto } from './dto/grade-complaint.dto';
export declare class GradeComplaintService {
    private readonly gradeComplaintRepository;
    private readonly gradeComplaintHistoryRepository;
    private readonly assessmentRepository;
    private readonly studentRepository;
    private readonly assessmentResultRepository;
    constructor(gradeComplaintRepository: Repository<GradeComplaint>, gradeComplaintHistoryRepository: Repository<GradeComplaintHistory>, assessmentRepository: Repository<Assessment>, studentRepository: Repository<Student>, assessmentResultRepository: Repository<AssessmentResult>);
    create(createGradeComplaintDto: CreateGradeComplaintDto): Promise<GradeComplaintResponseDto>;
    findAll(): Promise<GradeComplaintResponseDto[]>;
    findOne(id: string): Promise<GradeComplaintResponseDto>;
    findByStudent(studentId: string): Promise<GradeComplaintResponseDto[]>;
    findByAssessment(assessmentId: string): Promise<GradeComplaintResponseDto[]>;
    updateStatus(id: string, updateStatusDto: UpdateGradeComplaintStatusDto, changedByUserId: string): Promise<GradeComplaintResponseDto>;
    getHistory(id: string): Promise<GradeComplaintHistoryResponseDto[]>;
    remove(id: string): Promise<void>;
    private mapToGradeComplaintResponseDto;
}
