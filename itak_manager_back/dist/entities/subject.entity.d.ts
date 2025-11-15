import { ClassSubject } from './class-subject.entity';
import { Teacher } from './teacher.entity';
export declare class Subject {
    id: string;
    name: string;
    code: string;
    createdAt: Date;
    updatedAt: Date;
    classSubjects: ClassSubject[];
    teachers: Teacher[];
}
