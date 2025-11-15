import { Class } from './class.entity';
import { Subject } from './subject.entity';
import { TeachingAssignment } from './teaching-assignment.entity';
import { Assessment } from './assessment.entity';
export declare class ClassSubject {
    id: string;
    classId: string;
    subjectId: string;
    coefficient: number;
    weeklyHours: number;
    isOptional: boolean;
    createdAt: Date;
    updatedAt: Date;
    class: Class;
    subject: Subject;
    teachingAssignments: TeachingAssignment[];
    assessments: Assessment[];
}
