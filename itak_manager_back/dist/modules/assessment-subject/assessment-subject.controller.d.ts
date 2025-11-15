import { AssessmentSubjectService } from './assessment-subject.service';
import { CreateAssessmentSubjectDto, UpdateAssessmentSubjectDto, AssessmentSubjectResponseDto } from './dto/assessment-subject.dto';
export declare class AssessmentSubjectController {
    private readonly assessmentSubjectService;
    constructor(assessmentSubjectService: AssessmentSubjectService);
    create(createDto: CreateAssessmentSubjectDto, file: Express.Multer.File, req: any): Promise<AssessmentSubjectResponseDto>;
    findAll(assessmentId?: string, userId?: string): Promise<AssessmentSubjectResponseDto[]>;
    findOne(id: string): Promise<AssessmentSubjectResponseDto>;
    findByAssessment(assessmentId: string): Promise<AssessmentSubjectResponseDto[]>;
    findByUser(userId: string): Promise<AssessmentSubjectResponseDto[]>;
    update(id: string, updateDto: UpdateAssessmentSubjectDto, file: Express.Multer.File, req: any): Promise<AssessmentSubjectResponseDto>;
    remove(id: string, req: any): Promise<void>;
}
