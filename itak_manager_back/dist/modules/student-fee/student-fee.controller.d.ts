import { StudentFeeService } from './student-fee.service';
import { CreateStudentFeeDto, UpdateStudentFeeDto, PayStudentFeeDto, StudentFeesSummaryDto } from './dto/student-fee.dto';
export declare class StudentFeeController {
    private readonly studentFeeService;
    constructor(studentFeeService: StudentFeeService);
    create(createStudentFeeDto: CreateStudentFeeDto): Promise<import("../../entities/student-fee.entity").StudentFee>;
    findAll(): Promise<import("../../entities/student-fee.entity").StudentFee[]>;
    findOverdue(): Promise<import("../../entities/student-fee.entity").StudentFee[]>;
    markOverdue(): Promise<{
        message: string;
    }>;
    findByStudent(studentId: string): Promise<import("../../entities/student-fee.entity").StudentFee[]>;
    getStudentSummary(studentId: string): Promise<StudentFeesSummaryDto>;
    findOne(id: string): Promise<import("../../entities/student-fee.entity").StudentFee>;
    update(id: string, updateStudentFeeDto: UpdateStudentFeeDto): Promise<import("../../entities/student-fee.entity").StudentFee>;
    payFee(id: string, payStudentFeeDto: PayStudentFeeDto): Promise<never>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
