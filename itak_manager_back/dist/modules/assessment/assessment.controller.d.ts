import { AssessmentService } from './assessment.service';
import { CreateAssessmentDto, UpdateAssessmentDto, AssessmentResponseDto } from './dto/assessment.dto';
export declare class AssessmentController {
    private readonly assessmentService;
    constructor(assessmentService: AssessmentService);
    create(createAssessmentDto: CreateAssessmentDto): Promise<AssessmentResponseDto>;
    findAll(termId?: string, classSubjectId?: string, classId?: string): Promise<AssessmentResponseDto[]>;
    findOne(id: string): Promise<AssessmentResponseDto>;
    findByTerm(termId: string): Promise<AssessmentResponseDto[]>;
    findByClassSubject(classSubjectId: string): Promise<AssessmentResponseDto[]>;
    findByClass(classId: string): Promise<AssessmentResponseDto[]>;
    update(id: string, updateAssessmentDto: UpdateAssessmentDto): Promise<AssessmentResponseDto>;
    remove(id: string): Promise<void>;
}
