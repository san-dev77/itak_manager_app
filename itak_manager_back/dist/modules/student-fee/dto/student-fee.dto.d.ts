import { FeeStatus } from '../../../entities/student-fee.entity';
import { FeeTypeResponseDto } from '../../fee-type/dto/fee-type.dto';
import { StudentResponseDto } from '../../student/dto/student.dto';
export declare class CreateStudentFeeDto {
    studentId: string;
    feeTypeId: string;
    academicYearId: string;
    amountAssigned: number;
    dueDate?: string;
    status?: FeeStatus;
}
declare const UpdateStudentFeeDto_base: import("@nestjs/common").Type<Partial<CreateStudentFeeDto>>;
export declare class UpdateStudentFeeDto extends UpdateStudentFeeDto_base {
}
export declare class PayStudentFeeDto {
    paymentAmount: number;
}
export declare class StudentFeeResponseDto {
    id: string;
    studentId: string;
    feeTypeId: string;
    academicYearId: string;
    amountAssigned: number;
    amountPaid: number;
    dueDate?: string | Date;
    status: FeeStatus;
    createdAt: string | Date;
    updatedAt: string | Date;
    student?: StudentResponseDto;
    feeType?: FeeTypeResponseDto;
}
export declare class StudentFeesSummaryDto {
    studentId: string;
    totalAssigned: number;
    totalPaid: number;
    totalPending: number;
    totalOverdue: number;
    fees: StudentFeeResponseDto[];
}
export {};
