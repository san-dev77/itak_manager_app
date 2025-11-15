export declare class SubjectGradeDto {
    classSubjectId: string;
    subjectName: string;
    coefficient: number;
    classworkAverage: number | null;
    examAverage: number | null;
    overallAverage: number | null;
    totalAssessments: number;
    classworkCount: number;
    examCount: number;
}
export declare class TermGradesResponseDto {
    termId: string;
    termName: string;
    studentId: string;
    subjects: SubjectGradeDto[];
    weightedAverage: number | null;
}
export declare class ClassAverageDto {
    classSubjectId: string;
    subjectName: string;
    classAverage: number | null;
    studentCount: number;
    minGrade: number | null;
    maxGrade: number | null;
}
