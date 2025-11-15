import { Student } from './student.entity';
import { Class } from './class.entity';
export declare enum TransferReason {
    DISCIPLINARY = "disciplinary",
    ACADEMIC = "academic",
    MEDICAL = "medical",
    FAMILY_REQUEST = "family_request",
    ADMINISTRATIVE = "administrative",
    CAPACITY_ADJUSTMENT = "capacity_adjustment"
}
export declare class StudentTransfer {
    id: string;
    studentId: string;
    fromClassId: string;
    toClassId: string;
    transferDate: Date;
    reason: TransferReason;
    reasonDetails: string;
    year: string;
    approvedBy: string;
    approvalDate: Date;
    createdAt: Date;
    updatedAt: Date;
    student: Student;
    fromClass: Class;
    toClass: Class;
}
