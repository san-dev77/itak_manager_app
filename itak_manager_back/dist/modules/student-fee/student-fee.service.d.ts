import { Repository } from 'typeorm';
import { StudentFee } from '../../entities/student-fee.entity';
import { Student } from '../../entities/student.entity';
import { FeeType } from '../../entities/fee-type.entity';
import { CreateStudentFeeDto, UpdateStudentFeeDto, PayStudentFeeDto, StudentFeesSummaryDto } from './dto/student-fee.dto';
export declare class StudentFeeService {
    private readonly studentFeeRepository;
    private readonly studentRepository;
    private readonly feeTypeRepository;
    constructor(studentFeeRepository: Repository<StudentFee>, studentRepository: Repository<Student>, feeTypeRepository: Repository<FeeType>);
    create(createStudentFeeDto: CreateStudentFeeDto): Promise<StudentFee>;
    findAll(): Promise<StudentFee[]>;
    findOne(id: string): Promise<StudentFee>;
    findByStudent(studentId: string): Promise<StudentFee[]>;
    getStudentFeesSummary(studentId: string): Promise<StudentFeesSummaryDto>;
    update(id: string, updateStudentFeeDto: UpdateStudentFeeDto): Promise<StudentFee>;
    payFee(id: string, payStudentFeeDto: PayStudentFeeDto): never;
    remove(id: string): Promise<void>;
    findOverdueFees(): Promise<StudentFee[]>;
    markOverdueFees(): Promise<void>;
}
