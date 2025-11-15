import { CreateStudentTransferDto } from './create-student-transfer.dto';
declare const UpdateStudentTransferDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateStudentTransferDto>>;
export declare class UpdateStudentTransferDto extends UpdateStudentTransferDto_base {
    approvedBy?: string;
    approvalDate?: string;
}
export {};
