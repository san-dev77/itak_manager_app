import { Student } from './student.entity';
import { Class } from './class.entity';
export declare class StudentPromotion {
    id: string;
    studentId: string;
    fromClassId: string;
    toClassId: string;
    year: string;
    remarks: string;
    createdAt: Date;
    updatedAt: Date;
    student: Student;
    fromClass: Class;
    toClass: Class;
}
