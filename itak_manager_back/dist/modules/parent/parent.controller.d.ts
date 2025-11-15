import { ParentService } from './parent.service';
import { CreateParentDto, UpdateParentDto, ParentResponseDto, CreateStudentParentDto, StudentParentResponseDto } from './dto/parent.dto';
export declare class ParentController {
    private readonly parentService;
    constructor(parentService: ParentService);
    createParent(createParentDto: CreateParentDto): Promise<ParentResponseDto>;
    getAllParents(): Promise<ParentResponseDto[]>;
    getParentById(id: string): Promise<ParentResponseDto>;
    updateParent(id: string, updateParentDto: UpdateParentDto): Promise<ParentResponseDto>;
    deleteParent(id: string): Promise<void>;
    linkStudentToParent(createStudentParentDto: CreateStudentParentDto): Promise<StudentParentResponseDto>;
    getStudentParents(studentId: string): Promise<StudentParentResponseDto[]>;
}
