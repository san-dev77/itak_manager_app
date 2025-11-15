import { Teacher } from './teacher.entity';
import { ClassSubject } from './class-subject.entity';
export declare class TeachingAssignment {
    id: string;
    teacherId: string;
    classSubjectId: string;
    startDate: Date;
    endDate?: Date;
    createdAt: Date;
    updatedAt: Date;
    teacher: Teacher;
    classSubject: ClassSubject;
}
