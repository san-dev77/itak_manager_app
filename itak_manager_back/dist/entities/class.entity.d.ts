import { ClassSubject } from './class-subject.entity';
import { StudentClass } from './student-class.entity';
import { ClassCategory } from './class-category.entity';
import { StudentTransfer } from './student-transfer.entity';
export declare class Class {
    id: string;
    name: string;
    code: string;
    description: string;
    level: string;
    categoryId: string;
    capacity: number;
    orderLevel: number;
    createdAt: Date;
    updatedAt: Date;
    classCategory: ClassCategory;
    classSubjects: ClassSubject[];
    studentClasses: StudentClass[];
    transfersFrom: StudentTransfer[];
    transfersTo: StudentTransfer[];
}
