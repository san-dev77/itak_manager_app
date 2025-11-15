import { Repository } from 'typeorm';
import { StudentTransfer, TransferReason } from '../../entities/student-transfer.entity';
import { StudentClass } from '../../entities/student-class.entity';
import { Student } from '../../entities/student.entity';
import { Class } from '../../entities/class.entity';
import { CreateStudentTransferDto } from './dto/create-student-transfer.dto';
import { UpdateStudentTransferDto } from './dto/update-student-transfer.dto';
import { StudentTransferResponseDto } from './dto/student-transfer-response.dto';
import { UpdateStudentClassStatusDto } from './dto/update-student-class-status.dto';
export declare class StudentTransferService {
    private readonly studentTransferRepository;
    private readonly studentClassRepository;
    private readonly studentRepository;
    private readonly classRepository;
    constructor(studentTransferRepository: Repository<StudentTransfer>, studentClassRepository: Repository<StudentClass>, studentRepository: Repository<Student>, classRepository: Repository<Class>);
    create(createDto: CreateStudentTransferDto): Promise<StudentTransferResponseDto>;
    executeTransfer(transferId: string): Promise<void>;
    findAll(filters?: {
        studentId?: string;
        year?: string;
        reason?: TransferReason;
        fromClassId?: string;
        toClassId?: string;
    }): Promise<StudentTransferResponseDto[]>;
    findOne(id: string): Promise<StudentTransferResponseDto>;
    update(id: string, updateDto: UpdateStudentTransferDto): Promise<StudentTransferResponseDto>;
    remove(id: string): Promise<void>;
    reverseTransfer(transferId: string): Promise<void>;
    updateStudentClassStatus(studentId: string, classId: string, year: string, updateDto: UpdateStudentClassStatusDto): Promise<void>;
    private mapToResponseDto;
}
