import { GradeCalculationService } from './grade-calculation.service';
import { TermGradesResponseDto, ClassAverageDto } from './dto/term-grades-response.dto';
export declare class GradeCalculationController {
    private readonly gradeCalculationService;
    constructor(gradeCalculationService: GradeCalculationService);
    getStudentTermGrades(studentId: string, termId: string): Promise<TermGradesResponseDto>;
    getStudentYearGrades(studentId: string, schoolYearId: string): Promise<TermGradesResponseDto[]>;
    getClassAverages(classId: string, termId: string): Promise<ClassAverageDto[]>;
}
