import { Repository } from 'typeorm';
import { AssessmentResult } from '../../entities/assessment-result.entity';
import { Assessment } from '../../entities/assessment.entity';
import { ClassSubject } from '../../entities/class-subject.entity';
import { ClassAverageDto, TermGradesResponseDto } from './dto/term-grades-response.dto';
export declare class GradeCalculationService {
    private readonly assessmentResultRepository;
    private readonly assessmentRepository;
    private readonly classSubjectRepository;
    constructor(assessmentResultRepository: Repository<AssessmentResult>, assessmentRepository: Repository<Assessment>, classSubjectRepository: Repository<ClassSubject>);
    calculateTermGrades(studentId: string, termId: string): Promise<TermGradesResponseDto>;
    calculateYearGrades(studentId: string, schoolYearId: string): Promise<TermGradesResponseDto[]>;
    calculateClassAverages(classId: string, termId: string): Promise<ClassAverageDto[]>;
    private isClassworkType;
    private isExamType;
    private calculateWeightedAverage;
    private calculateCoefficientWeightedAverage;
}
