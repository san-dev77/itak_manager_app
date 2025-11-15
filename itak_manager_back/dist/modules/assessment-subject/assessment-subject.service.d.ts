import { Repository } from 'typeorm';
import { AssessmentSubject } from '../../entities/assessment-subject.entity';
import { Assessment } from '../../entities/assessment.entity';
import { User } from '../../entities/user.entity';
import { FileUploadService } from '../../services/file-upload.service';
import { CreateAssessmentSubjectDto, UpdateAssessmentSubjectDto, AssessmentSubjectResponseDto } from './dto/assessment-subject.dto';
export declare class AssessmentSubjectService {
    private readonly assessmentSubjectRepository;
    private readonly assessmentRepository;
    private readonly userRepository;
    private readonly fileUploadService;
    constructor(assessmentSubjectRepository: Repository<AssessmentSubject>, assessmentRepository: Repository<Assessment>, userRepository: Repository<User>, fileUploadService: FileUploadService);
    create(createDto: CreateAssessmentSubjectDto, file: Express.Multer.File, uploadedByUserId: string): Promise<AssessmentSubjectResponseDto>;
    findAll(): Promise<AssessmentSubjectResponseDto[]>;
    findOne(id: string): Promise<AssessmentSubjectResponseDto>;
    findByAssessment(assessmentId: string): Promise<AssessmentSubjectResponseDto[]>;
    findByUser(userId: string): Promise<AssessmentSubjectResponseDto[]>;
    update(id: string, updateDto: UpdateAssessmentSubjectDto, file?: Express.Multer.File, userId?: string): Promise<AssessmentSubjectResponseDto>;
    remove(id: string, userId?: string): Promise<void>;
    private mapToAssessmentSubjectResponseDto;
}
