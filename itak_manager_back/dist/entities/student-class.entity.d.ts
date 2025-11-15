import { Student } from './student.entity';
import { Class } from './class.entity';
export declare enum StudentClassStatus {
    ACTIVE = "active",
    TRANSFERRED = "transferred",
    REPEATING = "repeating",
    GRADUATED = "graduated",
    DROPPED = "dropped"
}
export declare class StudentClass {
    id: string;
    studentId: string;
    classId: string;
    startDate: Date;
    endDate: Date;
    status: StudentClassStatus;
    year: string;
    createdAt: Date;
    updatedAt: Date;
    student: Student;
    class: Class;
}
