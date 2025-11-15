import { Repository } from 'typeorm';
import { AssessmentResult } from '../../entities/assessment-result.entity';
import { Assessment } from '../../entities/assessment.entity';
import { Student } from '../../entities/student.entity';
import { CreateAssessmentResultDto, UpdateAssessmentResultDto, AssessmentResultResponseDto, BulkCreateAssessmentResultDto } from './dto/assessment-result.dto';
export declare class AssessmentResultService {
    private readonly assessmentResultRepository;
    private readonly assessmentRepository;
    private readonly studentRepository;
    constructor(assessmentResultRepository: Repository<AssessmentResult>, assessmentRepository: Repository<Assessment>, studentRepository: Repository<Student>);
    create(createAssessmentResultDto: CreateAssessmentResultDto): Promise<AssessmentResultResponseDto>;
    bulkCreate(bulkCreateDto: BulkCreateAssessmentResultDto): Promise<AssessmentResultResponseDto[]>;
    findAll(): Promise<AssessmentResultResponseDto[]>;
    findOne(id: string): Promise<AssessmentResultResponseDto>;
    findByAssessment(assessmentId: string): Promise<AssessmentResultResponseDto[]>;
    findByStudent(studentId: string): Promise<AssessmentResultResponseDto[]>;
    update(id: string, updateAssessmentResultDto: UpdateAssessmentResultDto): Promise<AssessmentResultResponseDto>;
    remove(id: string): Promise<void>;
    private mapToAssessmentResultResponseDto;
}
