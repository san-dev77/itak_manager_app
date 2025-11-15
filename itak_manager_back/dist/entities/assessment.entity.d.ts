import { Term } from './term.entity';
import { ClassSubject } from './class-subject.entity';
import { AssessmentResult } from './assessment-result.entity';
import { GradeComplaint } from './grade-complaint.entity';
import { AssessmentSubject } from './assessment-subject.entity';
import { SchoolYear } from './school-year.entity';
import { AssessmentAttendance } from './assessment-attendance.entity';
import { AssessmentVersion } from './assessment-version.entity';
export declare enum AssessmentType {
    EXAM = "exam",
    HOMEWORK = "homework",
    SUPERVISED_HOMEWORK = "supervised_homework",
    TEST = "test",
    QUIZ = "quiz",
    MONTHLY_COMPOSITION = "monthly_composition",
    CONTINUOUS_ASSESSMENT = "continuous_assessment"
}
export declare class Assessment {
    id: string;
    termId: string;
    classSubjectId: string;
    schoolYearId: string;
    type: AssessmentType;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    maxScore: number;
    weight: number;
    createdAt: Date;
    updatedAt: Date;
    term: Term;
    classSubject: ClassSubject;
    schoolYear: SchoolYear;
    results: AssessmentResult[];
    gradeComplaints: GradeComplaint[];
    subjects: AssessmentSubject[];
    attendances: AssessmentAttendance[];
    versions: AssessmentVersion[];
}
