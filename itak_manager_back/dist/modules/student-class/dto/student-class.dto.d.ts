import { StudentResponseDto } from '../../student/dto/student.dto';
import { ClassResponseDto } from '../../class/dto/class.dto';
export declare class CreateStudentClassDto {
    studentId: string;
    classId: string;
    startDate: string | Date;
    endDate?: string | Date;
}
declare const UpdateStudentClassDto_base: import("@nestjs/common").Type<Partial<CreateStudentClassDto>>;
export declare class UpdateStudentClassDto extends UpdateStudentClassDto_base {
}
export declare class StudentClassResponseDto {
    id: string;
    studentId: string;
    classId: string;
    startDate: string | Date;
    endDate: string | Date;
    year: string;
    createdAt: Date;
    updatedAt: Date;
    student?: StudentResponseDto;
    class?: ClassResponseDto;
}
export {};
