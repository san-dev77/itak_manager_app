export class SubjectGradeDto {
  classSubjectId: string;
  subjectName: string;
  coefficient: number; // Coefficient de la matière dans la classe (ex: Maths=4, Français=3)
  classworkAverage: number | null; // Moyenne des devoirs/tests de classe (pondérée par weight)
  examAverage: number | null; // Moyenne des examens (pondérée par weight)
  overallAverage: number | null; // Moyenne générale de la matière (pondérée par weight des évaluations)
  totalAssessments: number;
  classworkCount: number;
  examCount: number;
}

export class TermGradesResponseDto {
  termId: string;
  termName: string;
  studentId: string;
  subjects: SubjectGradeDto[];
  weightedAverage: number | null; // Moyenne pondérée par coefficients des matières
}

export class ClassAverageDto {
  classSubjectId: string;
  subjectName: string;
  classAverage: number | null;
  studentCount: number;
  minGrade: number | null;
  maxGrade: number | null;
}
