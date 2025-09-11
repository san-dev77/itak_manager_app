import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssessmentResult } from '../../entities/assessment-result.entity';
import { Assessment, AssessmentType } from '../../entities/assessment.entity';
import { ClassSubject } from '../../entities/class-subject.entity';
import {
  ClassAverageDto,
  SubjectGradeDto,
  TermGradesResponseDto,
} from './dto/term-grades-response.dto';

@Injectable()
export class GradeCalculationService {
  constructor(
    @InjectRepository(AssessmentResult)
    private readonly assessmentResultRepository: Repository<AssessmentResult>,
    @InjectRepository(Assessment)
    private readonly assessmentRepository: Repository<Assessment>,
    @InjectRepository(ClassSubject)
    private readonly classSubjectRepository: Repository<ClassSubject>,
  ) {}

  async calculateTermGrades(
    studentId: string,
    termId: string,
  ): Promise<TermGradesResponseDto> {
    // Récupérer toutes les notes de l'étudiant pour ce trimestre
    const results = await this.assessmentResultRepository
      .createQueryBuilder('result')
      .leftJoinAndSelect('result.assessment', 'assessment')
      .leftJoinAndSelect('assessment.classSubject', 'classSubject')
      .leftJoinAndSelect('classSubject.subject', 'subject')
      .leftJoinAndSelect('assessment.term', 'term')
      .where('result.studentId = :studentId', { studentId })
      .andWhere('assessment.termId = :termId', { termId })
      .getMany();

    // Grouper par matière
    const subjectGroups = new Map<string, AssessmentResult[]>();
    results.forEach((result) => {
      const classSubjectId = result.assessment.classSubjectId;
      if (!subjectGroups.has(classSubjectId)) {
        subjectGroups.set(classSubjectId, []);
      }
      subjectGroups.get(classSubjectId)!.push(result);
    });

    const subjects: SubjectGradeDto[] = [];
    let termName = '';

    // Calculer les moyennes par matière
    for (const [classSubjectId, subjectResults] of subjectGroups) {
      if (subjectResults.length === 0) continue;

      const firstResult = subjectResults[0];
      const classSubject = firstResult.assessment.classSubject;
      const subject = classSubject.subject;
      termName = firstResult.assessment.term?.name || '';

      // Séparer les évaluations par type
      const classworkResults = subjectResults.filter((result) =>
        this.isClassworkType(result.assessment.type),
      );
      const examResults = subjectResults.filter((result) =>
        this.isExamType(result.assessment.type),
      );

      // Calculer les moyennes
      const classworkAverage = this.calculateWeightedAverage(classworkResults);
      const examAverage = this.calculateWeightedAverage(examResults);
      const overallAverage = this.calculateWeightedAverage(subjectResults);

      subjects.push({
        classSubjectId,
        subjectName: subject.name,
        coefficient: classSubject.coefficient,
        classworkAverage,
        examAverage,
        overallAverage,
        totalAssessments: subjectResults.length,
        classworkCount: classworkResults.length,
        examCount: examResults.length,
      });
    }

    // Calculer la moyenne générale du trimestre
    const weightedAverage = this.calculateCoefficientWeightedAverage(subjects);

    return {
      termId,
      termName,
      studentId,
      subjects,
      weightedAverage,
    };
  }

  async calculateYearGrades(
    studentId: string,
    schoolYearId: string,
  ): Promise<TermGradesResponseDto[]> {
    // Récupérer tous les trimestres de l'année
    const terms = await this.assessmentRepository
      .createQueryBuilder('assessment')
      .leftJoinAndSelect('assessment.term', 'term')
      .where('assessment.schoolYearId = :schoolYearId', { schoolYearId })
      .select(['term.id', 'term.name'])
      .distinct(true)
      .getRawMany();

    const yearGrades: TermGradesResponseDto[] = [];

    for (const term of terms) {
      const termGrades = await this.calculateTermGrades(
        studentId,
        term.term_id,
      );
      yearGrades.push(termGrades);
    }

    return yearGrades;
  }

  async calculateClassAverages(
    classId: string,
    termId: string,
  ): Promise<ClassAverageDto[]> {
    const classAverages = await this.assessmentResultRepository
      .createQueryBuilder('result')
      .select([
        'classSubject.id AS "classSubjectId"',
        'subject.name AS "subjectName"',
        'AVG((result.score / assessment.maxScore) * 20) AS "classAverage"',
        'COUNT(DISTINCT result.studentId) AS "studentCount"',
        'MIN((result.score / assessment.maxScore) * 20) AS "minGrade"',
        'MAX((result.score / assessment.maxScore) * 20) AS "maxGrade"',
      ])
      .leftJoin('result.assessment', 'assessment')
      .leftJoin('assessment.classSubject', 'classSubject')
      .leftJoin('classSubject.subject', 'subject')
      .leftJoin('result.student', 'student')
      .leftJoin('student.studentClasses', 'studentClass')
      .where('assessment.termId = :termId', { termId })
      .andWhere('studentClass.classId = :classId', { classId })
      .andWhere('result.status IN (:...statuses)', {
        statuses: ['present', 'excused'],
      })
      .groupBy('classSubject.id')
      .addGroupBy('subject.name')
      .getRawMany();

    return classAverages.map((row) => ({
      classSubjectId: row.classSubjectId,
      subjectName: row.subjectName,
      classAverage: row.classAverage ? parseFloat(row.classAverage) : null,
      studentCount: parseInt(row.studentCount),
      minGrade: row.minGrade ? parseFloat(row.minGrade) : null,
      maxGrade: row.maxGrade ? parseFloat(row.maxGrade) : null,
    }));
  }

  private isClassworkType(type: AssessmentType): boolean {
    return [
      AssessmentType.HOMEWORK,
      AssessmentType.SUPERVISED_HOMEWORK,
      AssessmentType.TEST,
      AssessmentType.QUIZ,
      AssessmentType.CONTINUOUS_ASSESSMENT,
      AssessmentType.MONTHLY_COMPOSITION,
    ].includes(type);
  }

  private isExamType(type: AssessmentType): boolean {
    return type === AssessmentType.EXAM;
  }

  private calculateWeightedAverage(results: AssessmentResult[]): number | null {
    if (results.length === 0) return null;
    let totalWeightedScore = 0;
    let totalWeight = 0;
    results.forEach((result) => {
      // Si l'étudiant est absent ou exclu, sa note est considérée comme 0
      const effectiveScore = ['absent', 'excluded'].includes(result.status)
        ? 0
        : result.score;

      const percentage = (effectiveScore / result.assessment.maxScore) * 100; // Pourcentage brut (0-100)
      const weight = result.assessment.weight;
      totalWeightedScore += percentage * weight;
      totalWeight += weight;
    });
    // Convertir le résultat final en /20
    return totalWeight > 0
      ? Math.round((((totalWeightedScore / totalWeight) * 20) / 100) * 100) /
          100
      : null;
  }

  private calculateCoefficientWeightedAverage(
    subjects: SubjectGradeDto[],
  ): number | null {
    const validSubjects = subjects.filter((s) => s.overallAverage !== null);
    if (validSubjects.length === 0) return null;

    let totalWeightedScore = 0;
    let totalCoefficient = 0;

    validSubjects.forEach((subject) => {
      totalWeightedScore += subject.overallAverage! * subject.coefficient;
      totalCoefficient += subject.coefficient;
    });

    return totalCoefficient > 0
      ? Math.round((totalWeightedScore / totalCoefficient) * 100) / 100
      : null;
  }
}
