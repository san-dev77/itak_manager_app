import { TransferReason } from '../../../entities/student-transfer.entity';
export declare class StudentTransferResponseDto {
    id: string;
    studentId: string;
    fromClassId: string;
    toClassId: string;
    transferDate: Date;
    reason: TransferReason;
    reasonDetails?: string;
    year: string;
    approvedBy?: string;
    approvalDate?: Date;
    createdAt: Date;
    updatedAt: Date;
    student?: {
        id: string;
        firstName: string;
        lastName: string;
        studentNumber: string;
    };
    fromClass?: {
        id: string;
        name: string;
        code: string;
        level: string;
    };
    toClass?: {
        id: string;
        name: string;
        code: string;
        level: string;
    };
}
