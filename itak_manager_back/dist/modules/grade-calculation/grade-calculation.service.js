"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GradeCalculationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const assessment_result_entity_1 = require("../../entities/assessment-result.entity");
const assessment_entity_1 = require("../../entities/assessment.entity");
const class_subject_entity_1 = require("../../entities/class-subject.entity");
let GradeCalculationService = class GradeCalculationService {
    assessmentResultRepository;
    assessmentRepository;
    classSubjectRepository;
    constructor(assessmentResultRepository, assessmentRepository, classSubjectRepository) {
        this.assessmentResultRepository = assessmentResultRepository;
        this.assessmentRepository = assessmentRepository;
        this.classSubjectRepository = classSubjectRepository;
    }
    async calculateTermGrades(studentId, termId) {
        const results = await this.assessmentResultRepository
            .createQueryBuilder('result')
            .leftJoinAndSelect('result.assessment', 'assessment')
            .leftJoinAndSelect('assessment.classSubject', 'classSubject')
            .leftJoinAndSelect('classSubject.subject', 'subject')
            .leftJoinAndSelect('assessment.term', 'term')
            .where('result.studentId = :studentId', { studentId })
            .andWhere('assessment.termId = :termId', { termId })
            .getMany();
        const subjectGroups = new Map();
        results.forEach((result) => {
            const classSubjectId = result.assessment.classSubjectId;
            if (!subjectGroups.has(classSubjectId)) {
                subjectGroups.set(classSubjectId, []);
            }
            subjectGroups.get(classSubjectId).push(result);
        });
        const subjects = [];
        let termName = '';
        for (const [classSubjectId, subjectResults] of subjectGroups) {
            if (subjectResults.length === 0)
                continue;
            const firstResult = subjectResults[0];
            const classSubject = firstResult.assessment.classSubject;
            const subject = classSubject.subject;
            termName = firstResult.assessment.term?.name || '';
            const classworkResults = subjectResults.filter((result) => this.isClassworkType(result.assessment.type));
            const examResults = subjectResults.filter((result) => this.isExamType(result.assessment.type));
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
        const weightedAverage = this.calculateCoefficientWeightedAverage(subjects);
        return {
            termId,
            termName,
            studentId,
            subjects,
            weightedAverage,
        };
    }
    async calculateYearGrades(studentId, schoolYearId) {
        const terms = await this.assessmentRepository
            .createQueryBuilder('assessment')
            .leftJoinAndSelect('assessment.term', 'term')
            .where('assessment.schoolYearId = :schoolYearId', { schoolYearId })
            .select(['term.id', 'term.name'])
            .distinct(true)
            .getRawMany();
        const yearGrades = [];
        for (const term of terms) {
            const termGrades = await this.calculateTermGrades(studentId, term.term_id);
            yearGrades.push(termGrades);
        }
        return yearGrades;
    }
    async calculateClassAverages(classId, termId) {
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
    isClassworkType(type) {
        return [
            assessment_entity_1.AssessmentType.HOMEWORK,
            assessment_entity_1.AssessmentType.SUPERVISED_HOMEWORK,
            assessment_entity_1.AssessmentType.TEST,
            assessment_entity_1.AssessmentType.QUIZ,
            assessment_entity_1.AssessmentType.CONTINUOUS_ASSESSMENT,
            assessment_entity_1.AssessmentType.MONTHLY_COMPOSITION,
        ].includes(type);
    }
    isExamType(type) {
        return type === assessment_entity_1.AssessmentType.EXAM;
    }
    calculateWeightedAverage(results) {
        if (results.length === 0)
            return null;
        let totalWeightedScore = 0;
        let totalWeight = 0;
        results.forEach((result) => {
            const effectiveScore = ['absent', 'excluded'].includes(result.status)
                ? 0
                : result.score;
            const percentage = (effectiveScore / result.assessment.maxScore) * 100;
            const weight = result.assessment.weight;
            totalWeightedScore += percentage * weight;
            totalWeight += weight;
        });
        return totalWeight > 0
            ? Math.round((((totalWeightedScore / totalWeight) * 20) / 100) * 100) /
                100
            : null;
    }
    calculateCoefficientWeightedAverage(subjects) {
        const validSubjects = subjects.filter((s) => s.overallAverage !== null);
        if (validSubjects.length === 0)
            return null;
        let totalWeightedScore = 0;
        let totalCoefficient = 0;
        validSubjects.forEach((subject) => {
            totalWeightedScore += subject.overallAverage * subject.coefficient;
            totalCoefficient += subject.coefficient;
        });
        return totalCoefficient > 0
            ? Math.round((totalWeightedScore / totalCoefficient) * 100) / 100
            : null;
    }
};
exports.GradeCalculationService = GradeCalculationService;
exports.GradeCalculationService = GradeCalculationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(assessment_result_entity_1.AssessmentResult)),
    __param(1, (0, typeorm_1.InjectRepository)(assessment_entity_1.Assessment)),
    __param(2, (0, typeorm_1.InjectRepository)(class_subject_entity_1.ClassSubject)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], GradeCalculationService);
//# sourceMappingURL=grade-calculation.service.js.map