import { Repository } from 'typeorm';
import { Assessment } from '../../entities/assessment.entity';
import { Term } from '../../entities/term.entity';
import { ClassSubject } from '../../entities/class-subject.entity';
import { CreateAssessmentDto, UpdateAssessmentDto, AssessmentResponseDto } from './dto/assessment.dto';
export declare class AssessmentService {
    private readonly assessmentRepository;
    private readonly termRepository;
    private readonly classSubjectRepository;
    constructor(assessmentRepository: Repository<Assessment>, termRepository: Repository<Term>, classSubjectRepository: Repository<ClassSubject>);
    create(createAssessmentDto: CreateAssessmentDto): Promise<AssessmentResponseDto>;
    findAll(): Promise<AssessmentResponseDto[]>;
    findOne(id: string): Promise<AssessmentResponseDto>;
    findByTerm(termId: string): Promise<AssessmentResponseDto[]>;
    findByClassSubject(classSubjectId: string): Promise<AssessmentResponseDto[]>;
    findByClass(classId: string): Promise<AssessmentResponseDto[]>;
    update(id: string, updateAssessmentDto: UpdateAssessmentDto): Promise<AssessmentResponseDto>;
    remove(id: string): Promise<void>;
    private mapToAssessmentResponseDto;
}
