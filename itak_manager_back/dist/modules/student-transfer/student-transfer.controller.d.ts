import { StudentTransferService } from './student-transfer.service';
import { CreateStudentTransferDto } from './dto/create-student-transfer.dto';
import { UpdateStudentTransferDto } from './dto/update-student-transfer.dto';
import { UpdateStudentClassStatusDto } from './dto/update-student-class-status.dto';
import { StudentTransferResponseDto } from './dto/student-transfer-response.dto';
import { TransferReason } from '../../entities/student-transfer.entity';
export declare class StudentTransferController {
    private readonly studentTransferService;
    constructor(studentTransferService: StudentTransferService);
    create(createDto: CreateStudentTransferDto): Promise<StudentTransferResponseDto>;
    findAll(studentId?: string, year?: string, reason?: TransferReason, fromClassId?: string, toClassId?: string): Promise<StudentTransferResponseDto[]>;
    findOne(id: string): Promise<StudentTransferResponseDto>;
    findByStudent(studentId: string, year?: string): Promise<StudentTransferResponseDto[]>;
    findTransfersFromClass(classId: string, year?: string): Promise<StudentTransferResponseDto[]>;
    findTransfersToClass(classId: string, year?: string): Promise<StudentTransferResponseDto[]>;
    update(id: string, updateDto: UpdateStudentTransferDto): Promise<StudentTransferResponseDto>;
    executeTransfer(id: string): Promise<void>;
    reverseTransfer(id: string): Promise<void>;
    updateStudentClassStatus(studentId: string, classId: string, year: string, updateDto: UpdateStudentClassStatusDto): Promise<void>;
    remove(id: string): Promise<void>;
}
