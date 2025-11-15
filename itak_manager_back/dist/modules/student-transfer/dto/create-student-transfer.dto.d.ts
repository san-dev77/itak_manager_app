import { TransferReason } from '../../../entities/student-transfer.entity';
export declare class CreateStudentTransferDto {
    studentId: string;
    fromClassId: string;
    toClassId: string;
    transferDate: string;
    reason: TransferReason;
    reasonDetails?: string;
    year: string;
    approvedBy?: string;
}
