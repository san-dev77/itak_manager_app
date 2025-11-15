"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassAverageDto = exports.TermGradesResponseDto = exports.SubjectGradeDto = void 0;
class SubjectGradeDto {
    classSubjectId;
    subjectName;
    coefficient;
    classworkAverage;
    examAverage;
    overallAverage;
    totalAssessments;
    classworkCount;
    examCount;
}
exports.SubjectGradeDto = SubjectGradeDto;
class TermGradesResponseDto {
    termId;
    termName;
    studentId;
    subjects;
    weightedAverage;
}
exports.TermGradesResponseDto = TermGradesResponseDto;
class ClassAverageDto {
    classSubjectId;
    subjectName;
    classAverage;
    studentCount;
    minGrade;
    maxGrade;
}
exports.ClassAverageDto = ClassAverageDto;
//# sourceMappingURL=term-grades-response.dto.js.map