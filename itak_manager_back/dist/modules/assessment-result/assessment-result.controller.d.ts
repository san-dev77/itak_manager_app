import { AssessmentResultService } from './assessment-result.service';
import { CreateAssessmentResultDto, UpdateAssessmentResultDto, AssessmentResultResponseDto, BulkCreateAssessmentResultDto } from './dto/assessment-result.dto';
export declare class AssessmentResultController {
    private readonly assessmentResultService;
    constructor(assessmentResultService: AssessmentResultService);
    create(createAssessmentResultDto: CreateAssessmentResultDto): Promise<AssessmentResultResponseDto>;
    bulkCreate(bulkCreateDto: BulkCreateAssessmentResultDto): Promise<AssessmentResultResponseDto[]>;
    findAll(assessmentId?: string, studentId?: string): Promise<AssessmentResultResponseDto[]>;
    findOne(id: string): Promise<AssessmentResultResponseDto>;
    findByAssessment(assessmentId: string): Promise<AssessmentResultResponseDto[]>;
    findByStudent(studentId: string): Promise<AssessmentResultResponseDto[]>;
    update(id: string, updateAssessmentResultDto: UpdateAssessmentResultDto): Promise<AssessmentResultResponseDto>;
    remove(id: string): Promise<void>;
}
